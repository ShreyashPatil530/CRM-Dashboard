const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
        enum: ['WhatsApp', 'Website', 'Social Media', 'Phone Call', 'Lead Form', 'Manual Entry'],
    },
    status: {
        type: String,
        required: true,
        enum: ['New Lead', 'Contacted', 'Requirement Collected', 'Property Suggested', 'Visit Scheduled', 'Visit Completed', 'Booked', 'Lost'],
        default: 'New Lead',
    },
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
    },
    lastInteraction: {
        type: Date,
        default: Date.now,
    },
    timeline: [{
        action: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        performedBy: String,
        details: String,
    }],
    propertyInterest: {
        location: String,
        budget: Number,
        roomType: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lead', leadSchema);
