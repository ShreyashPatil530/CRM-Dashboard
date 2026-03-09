const express = require('express');
const router = express.Router();
const { getDashboardStats, getReminders } = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/reminders', getReminders);


module.exports = router;
