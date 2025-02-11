const mongoose = require('mongoose');

// Counter Schema
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number,
});

const Counter = mongoose.model('Counter', counterSchema);

// Function to get the next Grievance ID
const getNextGrievanceId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: 'grievanceId' },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if doesn't exist
  );
  return `G-${counter.sequence_value}`;
};

module.exports = { getNextGrievanceId };
