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
// Get available measurements
router.get('/list', auth_1.authenticateToken, async (req, res) => {
    try {
        const measurements = await dbService.getAvailableMeasurements();
        res.json(measurements);
    }
    catch (error) {
        console.error('Error fetching measurements:', error);
        res.status(500).json({ error: 'Failed to fetch measurements' });
    }
});
exports.default = router;
//# sourceMappingURL=measurement.js.map