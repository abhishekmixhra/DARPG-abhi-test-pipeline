const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    m_id: {
        type: Number,  // Assuming it's a number, change if it's different
        required: true
    },
    gro_id: {
        type: Number,
        required: true
    },
    // Other fields...
});

module.exports = mongoose.model('Category', CategorySchema);
