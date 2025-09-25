import express from 'express';
import { DatabaseService } from '../services/database';
import { authenticateToken } from './auth';

const router = express.Router();
const dbService = new DatabaseService();

// Get available measurements
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const measurements = await dbService.getAvailableMeasurements();
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
});

export default router;