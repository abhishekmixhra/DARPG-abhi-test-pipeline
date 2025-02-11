// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const adminSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
// }, {
//     timestamps: true
// });

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10,15}$/, // Validates phone number (10-15 digits)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Email validation
    },
    groType: {
        type: String,
        enum: ['0', '1'], // '0' for Central, '1' for State
        required: true,
    },
    ministry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ministry',
        required: true,
    },
    language: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Minimum 8 characters for password
    }
},
{
    timestamps: true
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
