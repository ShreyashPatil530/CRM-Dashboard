const Lead = require('../models/Lead');
const Visit = require('../models/Visit');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
    try {
        const totalLeads = await Lead.countDocuments();

        // Group by status
        const leadsByStatus = await Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Group by source
        const leadsBySource = await Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } }
        ]);

        const scheduledVisits = await Visit.countDocuments({ outcome: 'Scheduled' });
        const completedVisits = await Visit.countDocuments({ outcome: 'Completed' });
        const totalBookings = await Lead.countDocuments({ status: 'Booked' });

        res.status(200).json({
            totalLeads,
            leadsByStatus,
            leadsBySource,
            scheduledVisits,
            completedVisits,
            totalBookings,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get leads requiring follow-up
// @route   GET /api/dashboard/reminders
const getReminders = async (req, res, next) => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const highPriorityLeads = await Lead.find({
            status: { $in: ['New Lead', 'Contacted', 'Requirement Collected'] },
            lastInteraction: { $lt: yesterday }
        }).populate('assignedAgent').limit(5);

        res.status(200).json(highPriorityLeads);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats,
    getReminders,
};

