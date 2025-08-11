const express = require('express');
const cors = require('cors');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes');
const connectDB = require('./database/db');

require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to database
connectDB();

const port = process.env.PORT || 4000;

// Routes
app.use('/api/transactions', transactionRoutes);

// Basic health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Transaction API is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`API available at: http://localhost:${port}/api/transactions`);
});