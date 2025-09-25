export interface Person {
    person_id: number;
    gender_concept_id: number;
    year_of_birth: number;
    month_of_birth?: number;
    day_of_birth?: number;
}
export interface Concept {
    concept_id: number;
    concept_name: string;
    domain_id: string;
    vocabulary_id: string;
    concept_class_id: string;
    standard_concept?: string;
    concept_code: string;
}
export interface ConditionOccurrence {
    condition_occurrence_id: number;
    person_id: number;
    condition_concept_id: number;
    condition_start_date: string;
}
export interface Measurement {
    measurement_id: number;
    person_id: number;
    measurement_concept_id: number;
    measurement_date: string;
    value_as_number?: number;
}
export interface CohortStats {
    diseaseGroup: {
        count: number;
        ageGroups: {
            [key: string]: number;
        };
        sexDistribution: {
            [key: string]: number;
        };
    };
    nonDiseaseGroup: {
        count: number;
        ageGroups: {
            [key: string]: number;
        };
        sexDistribution: {
            [key: string]: number;
        };
    };
}
export declare class DatabaseService {
    private db;
    private dbPath;
    constructor();
    private initializeDatabase;
    query(sql: string, params?: any[]): Promise<any[]>;
    queryOne(sql: string, params?: any[]): Promise<any>;
    getAvailableDiseases(): Promise<any[]>;
    getAvailableMeasurements(): Promise<any[]>;
    buildCohorts(diseaseConceptId: number): Promise<CohortStats>;
    private calculateGroupStats;
    getMeasurementData(diseaseConceptId: number, measurementConceptId: number): Promise<any>;
    private calculateStats;
    close(): void;
}
export default DatabaseService;
//# sourceMappingURL=database.d.ts.map