const express = require('express');
const app = express();
const transactionRoutes = require('./routes/transactionRoutes');
const connectDB = require('./database/db');
require('dotenv').config();
app.use(express.json());
connectDB();
const port = process.env.PORT || 4000;

app.use('/api/transactions', transactionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})