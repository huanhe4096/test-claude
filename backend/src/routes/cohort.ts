import express from 'express';
import { DatabaseService } from '../services/database';
import { authenticateToken } from './auth';

const router = express.Router();
const dbService = new DatabaseService();

// Get available diseases for cohort building
router.get('/diseases', authenticateToken, async (req, res) => {
  try {
    const diseases = await dbService.getAvailableDiseases();
    res.json(diseases);
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

// Build cohorts based on disease selection
router.post('/build', authenticateToken, async (req, res) => {
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
  } catch (error) {
    console.error('Error building cohorts:', error);
    res.status(500).json({ error: 'Failed to build cohorts' });
  }
});

// Get cohort comparison for a specific measurement
router.post('/compare', authenticateToken, async (req, res) => {
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
  } catch (error) {
    console.error('Error comparing cohorts:', error);
    res.status(500).json({ error: 'Failed to compare cohorts' });
  }
});

export default router;