const Lead = require('../models/Lead');
const { assignLeadRoundRobin } = require('../utils/assignLead');

// @desc    Capture a new lead
// @route   POST /api/leads
const createLead = async (req, res, next) => {
    try {
        const { name, phone, source, propertyInterest } = req.body;

        if (!name || !phone || !source) {
            res.status(400);
            throw new Error('Name, Phone, and Source are required');
        }

        // Automatically assign lead
        const assignedAgentId = await assignLeadRoundRobin();

        const lead = await Lead.create({
            name,
            phone,
            source,
            propertyInterest,
            assignedAgent: assignedAgentId,
            timeline: [{
                action: 'Lead Captured',
                details: `Lead captured from ${source} and assigned to agent.`,
                performedBy: 'System',
            }],
        });

        res.status(201).json(lead);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all leads
// @route   GET /api/leads
const getLeads = async (req, res, next) => {
    try {
        const leads = await Lead.find().populate('assignedAgent').sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (error) {
        next(error);
    }
};

// @desc    Get lead details
// @route   GET /api/leads/:id
const getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id).populate('assignedAgent');

        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }

        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead status (pipeline stage)
// @route   PATCH /api/leads/:id/status
const updateLeadStatus = async (req, res, next) => {
    try {
        const { status, note } = req.body;
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }

        const oldStatus = lead.status;
        lead.status = status;
        lead.lastInteraction = new Date();
        lead.timeline.push({
            action: 'Status Updated',
            details: `Status changed from ${oldStatus} to ${status}. ${note || ''}`,
            performedBy: 'Agent/System',
        });

        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead details
// @route   PUT /api/leads/:id
const updateLead = async (req, res, next) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lead) {
            res.status(404);
            throw new Error('Lead not found');
        }

        res.status(200).json(lead);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createLead,
    getLeads,
    getLeadById,
    updateLeadStatus,
    updateLead,
};
