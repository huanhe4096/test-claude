"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../services/database");
const auth_1 = require("./auth");
const router = express_1.default.Router();
const dbService = new database_1.DatabaseService();
// Get available diseases for cohort building
router.get('/diseases', auth_1.authenticateToken, async (req, res) => {
    try {
        const diseases = await dbService.getAvailableDiseases();
        res.json(diseases);
    }
    catch (error) {
        console.error('Error fetching diseases:', error);
        res.status(500).json({ error: 'Failed to fetch diseases' });
    }
});
// Build cohorts based on disease selection
router.post('/build', auth_1.authenticateToken, async (req, res) => {
    try {
        const { diseaseConceptId } = req.body;
        if (!diseaseConceptId) {
            return res.status(400).json({ error: 'Disease concept ID is required' });
        }
        const cohortStats = await dbService.buildCohorts(diseaseConceptId);
        res.json({
            message: 'Cohorts built successfully',
            data: cohortStats
        });
    }
    catch (error) {
        console.error('Error building cohorts:', error);
        res.status(500).json({ error: 'Failed to build cohorts' });
    }
});
// Get cohort comparison for a specific measurement
router.post('/compare', auth_1.authenticateToken, async (req, res) => {
    try {
        const { diseaseConceptId, measurementConceptId } = req.body;
        if (!diseaseConceptId || !measurementConceptId) {
            return res.status(400).json({
                error: 'Disease concept ID and measurement concept ID are required'
            });
        }
        const comparisonData = await dbService.getMeasurementData(diseaseConceptId, measurementConceptId);
        res.json({
            message: 'Cohort comparison data retrieved successfully',
            data: comparisonData
        });
    }
    catch (error) {
        console.error('Error comparing cohorts:', error);
        res.status(500).json({ error: 'Failed to compare cohorts' });
    }
});
exports.default = router;
//# sourceMappingURL=cohort.js.map