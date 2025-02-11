const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MinistrySchema = new mongoose.Schema({
    m_name: { type: String, required: true }, // Ministry name
    m_type: { type: String, required: true }, // Central or State
});

module.exports = mongoose.model('ministry', MinistrySchema);
