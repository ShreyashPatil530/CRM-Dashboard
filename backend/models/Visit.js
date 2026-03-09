const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead',
        required: true,
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: true,
    },
    propertyTitle: {
        type: String,
        required: true,
    },
    propertyLocation: String,
    dateTime: {
        type: Date,
        required: true,
    },
    outcome: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Rescheduled', 'No Show', 'Cancelled'],
        default: 'Scheduled',
    },
    notes: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Visit', visitSchema);
