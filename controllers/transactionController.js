const TransactionModel = require('../models/TransactionModel');

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

// Lifetime or today balance
exports.getBalance = async (req, res) => {
    try {
        const { date } = req.query;

        let filter = {};

        // If user passes date=today, filter to today's transactions
        if (date && date.toLowerCase() === 'today') {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }
        // Else → no filter → lifetime profit

        const transactions = await TransactionModel.find(filter);

        let income = 0;
        let expense = 0;

        transactions.forEach(tx => {
            if (tx.category?.toLowerCase() === 'income') {
                income += tx.amount;
            } else if (tx.category?.toLowerCase() === 'expense') {
                expense += tx.amount;
            }
        });

        const balance = income - expense;
        const status = balance >= 0 ? 'profit' : 'loss';

        res.json({
            filterType: date && date.toLowerCase() === 'today' ? 'today' : 'lifetime',
            income,
            expense,
            balance,
            status
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionsByDate = async (req, res) => {
    try {
        let { date, type } = req.query;

        if (!date) {
            const today = new Date();
            date = today.toISOString().split("T")[0];
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        let filter = { date: { $gte: startOfDay, $lte: endOfDay } };

        // If type=expense, filter only expenses
        if (type && type.toLowerCase() === 'expense') {
            filter.category = 'Expense';
        }

        const transactions = await TransactionModel.find(filter);
        res.json(transactions);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
