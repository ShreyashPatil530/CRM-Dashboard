const express = require('express');
const router = express.Router();
const {
    createLead,
    getLeads,
    getLeadById,
    updateLeadStatus,
    updateLead,
} = require('../controllers/leadController');

router.route('/').get(getLeads).post(createLead);
router.route('/:id').get(getLeadById).put(updateLead);
router.route('/:id/status').patch(updateLeadStatus);

module.exports = router;
