// routes/slowLane.js
const express = require('express');
const router = express.Router();
const { getLogisticsStream } = require('../controllers/logisticsController');
const { protect, authorizeStationAccess } = require('../middleware/authMiddleware');


// 0. Health check endpoint to prevent Render from sleeping & verify server status
router.get('/health', (req, res) => {
    res.status(200).json({ status: "success", message: "Polar Twin Core Operational" });
});

// 1. GET Logistics Data (Sliced - e.g., /api/logistics/Maitri/supplies/data)
router.get('/:stationId/:section/data', protect, authorizeStationAccess, getLogisticsStream);

// 2. GET Logistics Data (Full Payload - e.g., /api/logistics/Maitri/data)
router.get('/:stationId/data', protect, authorizeStationAccess, getLogisticsStream);

module.exports = router;