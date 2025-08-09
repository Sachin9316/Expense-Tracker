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


// Add today's income
exports.addTodayIncome = async (req, res) => {
    try {
        const { amount, description } = req.body;
        if (!amount || !description) {
            return res.status(400).json({ error: 'Amount and description are required.' });
        }
        const transaction = await TransactionModel.create({
            amount,
            description,
            category: 'Income',
            date: new Date()
        });
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get overall balance (profit)
exports.getBalance = async (req, res) => {
    try {
        const transactions = await TransactionModel.find();
        let income = 0;
        let expense = 0;
        transactions.forEach(tx => {
            if (tx.category.toLowerCase() === 'income') {
                income += tx.amount;
            } else {
                expense += tx.amount;
            }
        });
        const balance = income - expense;
        res.json({ balance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};