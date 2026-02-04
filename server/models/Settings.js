const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    monthlyLimit: {
        type: Number,
        default: 0
    },
    dailyLimit: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', SettingsSchema);
