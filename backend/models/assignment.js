const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
     ref: 'Project',
  },
  allocationPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
