const Visit = require('../models/Visit');
const Lead = require('../models/Lead');

// @desc    Schedule a visit
// @route   POST /api/visits
const scheduleVisit = async (req, res, next) => {
    try {
        const { leadId, agentId, propertyTitle, dateTime, notes } = req.body;

        const visit = await Visit.create({
            leadId,
            agentId,
            propertyTitle,
            dateTime,
            notes,
        });

        // Update lead status to 'Visit Scheduled' if it's not already
        await Lead.findByIdAndUpdate(leadId, {
            status: 'Visit Scheduled',
            $push: {
                timeline: {
                    action: 'Visit Scheduled',
                    details: `Visit scheduled for ${propertyTitle} on ${new Date(dateTime).toLocaleString()}`,
                    performedBy: 'Agent',
                }
            },
            lastInteraction: new Date()
        });

        res.status(201).json(visit);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all visits
// @route   GET /api/visits
const getVisits = async (req, res, next) => {
    try {
        const visits = await Visit.find()
            .populate('leadId', 'name phone')
            .populate('agentId', 'name')
            .sort({ dateTime: 1 });
        res.status(200).json(visits);
    } catch (error) {
        next(error);
    }
};

// @desc    Update visit outcome
// @route   PATCH /api/visits/:id/outcome
const updateVisitOutcome = async (req, res, next) => {
    try {
        const { outcome, notes } = req.body;
        const visit = await Visit.findByIdAndUpdate(
            req.params.id,
            { outcome, notes },
            { new: true }
        );

        if (outcome === 'Completed') {
            await Lead.findByIdAndUpdate(visit.leadId, {
                status: 'Visit Completed',
                $push: {
                    timeline: {
                        action: 'Visit Completed',
                        details: `Property visit for ${visit.propertyTitle} was completed.`,
                        performedBy: 'Agent',
                    }
                },
                lastInteraction: new Date()
            });
        }

        res.status(200).json(visit);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    scheduleVisit,
    getVisits,
    updateVisitOutcome,
};
