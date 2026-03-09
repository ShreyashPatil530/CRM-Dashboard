const Agent = require('../models/Agent');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public (for MVP)
const getAgents = async (req, res, next) => {
    try {
        const agents = await Agent.find().sort({ createdAt: -1 });
        res.status(200).json(agents);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Public (for MVP)
const createAgent = async (req, res, next) => {
    try {
        const { name, email, role } = req.body;
        const agentExists = await Agent.findOne({ email });

        if (agentExists) {
            res.status(400);
            throw new Error('Agent already exists');
        }

        const agent = await Agent.create({ name, email, role });
        res.status(201).json(agent);
    } catch (error) {
        next(error);
    }
};

// @desc    Update agent status or details
// @route   PUT /api/agents/:id
// @access  Public (for MVP)
const updateAgent = async (req, res, next) => {
    try {
        const agent = await Agent.findById(req.params.id);

        if (!agent) {
            res.status(404);
            throw new Error('Agent not found');
        }

        const updatedAgent = await Agent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedAgent);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAgents,
    createAgent,
    updateAgent,
};
