const TransactionModel = require('../models/TransactionModel');

// Create a transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await TransactionModel.create(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Read all transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await TransactionModel.find();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read a single transaction
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await TransactionModel.findById(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await TransactionModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await TransactionModel.findByIdAndDelete(req.params.id);
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};