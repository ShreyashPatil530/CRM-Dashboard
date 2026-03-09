const Agent = require('../models/Agent');

/**
 * Assigns a lead to an agent using Round-Robin logic.
 * Finds the active agent who was assigned a lead the longest time ago.
 */
const assignLeadRoundRobin = async () => {
    try {
        // Find active agents sorted by lastAssignedAt ascending
        const agent = await Agent.findOne({ isActive: true }).sort({ lastAssignedAt: 1 });

        if (!agent) {
            return null;
        }

        // Update the agent's lastAssignedAt and lead count
        agent.lastAssignedAt = new Date();
        agent.currentLeadCount += 1;
        await agent.save();

        return agent._id;
    } catch (error) {
        console.error('Error in lead assignment logic:', error);
        return null;
    }
};

module.exports = {
    assignLeadRoundRobin,
};
