const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth'); // Corrected path for middleware
const User = require('../../models/api/User');  // Corrected path for User model
const app = express.Router();

// User Registration
const STATIC_OTP = "123456"; // Define your static OTP here

app.post('/register', async (req, res) => {
    try {
        const { name, pinCode, state, district, email, mobile, otp } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({ status: false, message: 'User already exists' });
        }

        // Verify the OTP
        if (otp !== STATIC_OTP) {
            return res.status(400).json({ status: false, message: 'Invalid OTP' });
        }

        // Create a new user
        const user = new User({
            name,
            pinCode,
            state,
            district,
            email,
            mobile
        });
        await user.save();

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send response with success message and token
        res.status(201).json({
            status: true,
            message: 'User registered successfully',
            token: token,
            data: user.toObject()

        });
    } catch (err) {
        console.error('Error in registration:', err.message);
        res.status(500).json({ status: false, message: 'Server error', error: err.message });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { mobile, email, otp } = req.body;

        // Check if either mobile or email is provided
        if (!mobile && !email) {
            return res.status(400).json({ status: false, message: 'Mobile or Email is required' });
        }

        // Determine whether to look up by mobile or email
        let user;
        if (mobile) {
            // Check if the user exists by mobile number
            user = await User.findOne({ mobile });
        } else if (email) {
            // Check if the user exists by email
            user = await User.findOne({ email });
        }

        // If no user found, return error
        if (!user) {
            return res.status(400).json({ status: false, message: 'User not found' });
        }

        // Verify the OTP
        if (otp !== STATIC_OTP) {
            return res.status(400).json({ status: false, message: 'Invalid OTP' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Prepare the user data to return (exclude password)
        const result = {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            pinCode: user.pinCode,
            state: user.state,
            district: user.district
        };

        // Send response with the token and user data
        res.json({
            status: true,
            message: 'Login successful',
            token: token,
            data: result
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ status: false, message: 'Server error', error: err.message });
    }
});

// Protected Route
app.get('/protected', auth, (req, res) => {
    res.json({ status: true, message: `Hello, ${req.user.name}! This is a protected route.` });
});


module.exports = app;
