const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'agent',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    currentLeadCount: {
        type: Number,
        default: 0,
    },
    lastAssignedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Agent', agentSchema);
