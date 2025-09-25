"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const csv_parser_1 = __importDefault(require("csv-parser"));
class DatabaseService {
    constructor() {
        this.dbPath = process.env.DATABASE_PATH || path_1.default.join(__dirname, '../../../database/omop.db');
        this.db = new better_sqlite3_1.default(this.dbPath);
        this.initializeDatabase();
    }
    async initializeDatabase() {
        try {
            // Create tables
            const schemaPath = path_1.default.join(__dirname, '../../../database/schema.sql');
            const schema = fs_1.default.readFileSync(schemaPath, 'utf8');
            this.db.exec(schema);
            // Insert seed data
            const seedPath = path_1.default.join(__dirname, '../../../database/seed_data.sql');
            const seedData = fs_1.default.readFileSync(seedPath, 'utf8');
            this.db.exec(seedData);
            console.log('Database initialized successfully');
        }
        catch (error) {
            console.error('Database initialization failed:', error);
        }
    }
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(sql);
                const rows = stmt.all(params);
                resolve(rows);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    queryOne(sql, params = []) {
        return new Promise((resolve, reject) => {
            try {
                const stmt = this.db.prepare(sql);
                const row = stmt.get(params);
                resolve(row);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    // Get available diseases from concept mapping
    async getAvailableDiseases() {
        const conceptMappingPath = path_1.default.join(__dirname, '../../../database/concept_mapping.csv');
        return new Promise((resolve, reject) => {
            const diseases = {};
            fs_1.default.createReadStream(conceptMappingPath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                if (!diseases[row.disease_category]) {
                    diseases[row.disease_category] = {
                        name: row.disease_category,
                        concept_id: parseInt(row.omop_concept_id),
                        concept_name: row.concept_name
                    };
                }
            })
                .on('end', () => {
                resolve(Object.values(diseases));
            })
                .on('error', reject);
        });
    }
    // Get available measurements
    async getAvailableMeasurements() {
        const measurementsPath = path_1.default.join(__dirname, '../../../database/measurement_concepts.csv');
        return new Promise((resolve, reject) => {
            const measurements = [];
            fs_1.default.createReadStream(measurementsPath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => {
                measurements.push({
                    concept_id: parseInt(row.measurement_concept_id),
                    concept_name: row.concept_name,
                    description: row.description
                });
            })
                .on('end', () => {
                resolve(measurements);
            })
                .on('error', reject);
        });
    }
    // Build cohorts based on disease concept
    async buildCohorts(diseaseConceptId) {
        // Get disease cohort
        const diseaseQuery = `
      SELECT DISTINCT p.person_id, p.gender_concept_id, p.year_of_birth
      FROM person p
      INNER JOIN condition_occurrence co ON p.person_id = co.person_id
      WHERE co.condition_concept_id = ?
    `;
        // Get non-disease cohort (excluding people with the disease)
        const nonDiseaseQuery = `
      SELECT p.person_id, p.gender_concept_id, p.year_of_birth
      FROM person p
      WHERE p.person_id NOT IN (
        SELECT DISTINCT person_id
        FROM condition_occurrence
        WHERE condition_concept_id = ?
      )
    `;
        const diseasePatients = await this.query(diseaseQuery, [diseaseConceptId]);
        const nonDiseasePatients = await this.query(nonDiseaseQuery, [diseaseConceptId]);
        return {
            diseaseGroup: this.calculateGroupStats(diseasePatients),
            nonDiseaseGroup: this.calculateGroupStats(nonDiseasePatients)
        };
    }
    calculateGroupStats(patients) {
        const currentYear = new Date().getFullYear();
        const ageGroups = { '<20': 0, '20-40': 0, '40-60': 0, '60+': 0 };
        const sexDistribution = { 'Male': 0, 'Female': 0 };
        patients.forEach(patient => {
            const age = currentYear - patient.year_of_birth;
            // Age groups
            if (age < 20)
                ageGroups['<20']++;
            else if (age < 40)
                ageGroups['20-40']++;
            else if (age < 60)
                ageGroups['40-60']++;
            else
                ageGroups['60+']++;
            // Sex distribution (8507 = Male, 8532 = Female)
            if (patient.gender_concept_id === 8507)
                sexDistribution['Male']++;
            else if (patient.gender_concept_id === 8532)
                sexDistribution['Female']++;
        });
        return {
            count: patients.length,
            ageGroups,
            sexDistribution
        };
    }
    // Get measurement data for cohort comparison
    async getMeasurementData(diseaseConceptId, measurementConceptId) {
        const query = `
      SELECT
        m.value_as_number,
        CASE
          WHEN co.condition_concept_id IS NOT NULL THEN 'Disease'
          ELSE 'Non-Disease'
        END as group_type,
        p.gender_concept_id,
        p.year_of_birth
      FROM measurement m
      INNER JOIN person p ON m.person_id = p.person_id
      LEFT JOIN condition_occurrence co ON p.person_id = co.person_id AND co.condition_concept_id = ?
      WHERE m.measurement_concept_id = ?
        AND m.value_as_number IS NOT NULL
      ORDER BY group_type, m.value_as_number
    `;
        const results = await this.query(query, [diseaseConceptId, measurementConceptId]);
        // Group by disease/non-disease
        const diseaseGroup = results.filter(r => r.group_type === 'Disease').map(r => r.value_as_number);
        const nonDiseaseGroup = results.filter(r => r.group_type === 'Non-Disease').map(r => r.value_as_number);
        return {
            diseaseGroup: {
                values: diseaseGroup,
                stats: this.calculateStats(diseaseGroup)
            },
            nonDiseaseGroup: {
                values: nonDiseaseGroup,
                stats: this.calculateStats(nonDiseaseGroup)
            }
        };
    }
    calculateStats(values) {
        if (values.length === 0) {
            return { n: 0, median: null, p25: null, p75: null, mean: null };
        }
        const sorted = [...values].sort((a, b) => a - b);
        const n = sorted.length;
        const mean = sorted.reduce((sum, val) => sum + val, 0) / n;
        const getPercentile = (arr, percentile) => {
            const index = (percentile / 100) * (arr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            if (lower === upper)
                return arr[lower];
            return arr[lower] * (upper - index) + arr[upper] * (index - lower);
        };
        return {
            n,
            median: getPercentile(sorted, 50),
            p25: getPercentile(sorted, 25),
            p75: getPercentile(sorted, 75),
            mean: Math.round(mean * 100) / 100
        };
    }
    close() {
        this.db.close();
    }
}
exports.DatabaseService = DatabaseService;
exports.default = DatabaseService;
//# sourceMappingURL=database.js.map