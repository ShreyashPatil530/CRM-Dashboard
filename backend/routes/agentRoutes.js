const express = require('express');
const router = express.Router();
const {
    getAgents,
    createAgent,
    updateAgent,
} = require('../controllers/agentController');

router.route('/').get(getAgents).post(createAgent);
router.route('/:id').put(updateAgent);

module.exports = router;
