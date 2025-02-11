const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/api/User');
const auth = require('./middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRoutes = require('./routes/admin/adminRoutes'); // Adjust path as needed
const userRoutes = require('./routes/api/userRoutes');
const grievanceRoutes = require('./routes/api/grievanceRoutes');
const eventManagerRoutes = require('./routes/admin/eventManager');
const reportsManager = require('./routes/admin/reportsManager');
const categoryRoutes = require('./routes/api/categoryRoutes');
const path = require('path');
const session = require('express-session');  // Import express-session
const app = express();
require('dotenv').config();


const cors = require('cors');


// Use CORS middleware to allow requests from localhost:3000
app.use(cors({
 // origin: 'http://localhost:5000',  // Allow requests from React app
 origin: '*',
methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));





app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json()); // For API JSON requests
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'node_modules')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve files

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
}));

// MongoDB Connection
const mongoURI = 'mongodb://3.108.40.230:27017/darpg';
async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 20000, // Timeout after 20 seconds
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process on failure
    }
}
connectDB();

// Middleware to set adminName globally
app.use((req, res, next) => {
    res.locals.adminName = req.session.adminName || null;
    next();
});

app.use('/admin', adminRoutes); // Admin routes under `admin`
app.use('/api/users', userRoutes);
// API Routes
app.use('/api/grievances', grievanceRoutes);
app.use('/api/category', categoryRoutes);
app.use('/events/', eventManagerRoutes);
app.use('/reports/', reportsManager);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
