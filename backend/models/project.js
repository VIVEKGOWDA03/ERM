const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    requiredSkills: [{ type: String }],
    teamSize: { type: Number },
    status: { 
        type: String, 
        enum: ['planning', 'active', 'completed'], 
        default: 'planning' 
    },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Project', projectSchema);