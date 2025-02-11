const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pinCode: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    email: { type: String, required: true},
    mobile: { type: String, required: true, unique: true },
    //password: { type: String, required: true },
}, {
    timestamps: true  // This automatically adds createdAt and updatedAt fields
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
