const mongoose = require('mongoose');

// Replace with your MongoDB connection string
const mongoURI = "mongodb://localhost:27017/testnode";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handlers for connection
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

db.once('open', () => {
  console.log('Successfully connected to MongoDB!');
});
