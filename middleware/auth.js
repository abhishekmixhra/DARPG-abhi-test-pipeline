const jwt = require('jsonwebtoken');
const User = require('../models/api/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ status: false, message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid token, authorization denied' });
        }

        req.user = user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        res.status(401).json({ status: false, message: 'Invalid token', error: err.message });
    }
};

module.exports = auth;
