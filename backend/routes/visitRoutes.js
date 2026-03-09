const express = require('express');
const router = express.Router();
const {
    scheduleVisit,
    getVisits,
    updateVisitOutcome,
} = require('../controllers/visitController');

router.route('/').get(getVisits).post(scheduleVisit);
router.route('/:id/outcome').patch(updateVisitOutcome);

module.exports = router;
