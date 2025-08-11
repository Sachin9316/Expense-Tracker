const TransactionModel = require('../models/TransactionModel');

// Create a new transaction
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await TransactionModel.create(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all transactions with optional date filtering
exports.getTransactions = async (req, res) => {
    try {
        const { date } = req.query;
        let filter = {};

        // If date is provided, filter by specific date
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }

        const transactions = await TransactionModel.find(filter).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await TransactionModel.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
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
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await TransactionModel.findByIdAndDelete(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add today's income (specific endpoint for income)
exports.addTodayIncome = async (req, res) => {
    try {
        const { amount, description, category } = req.body;

        if (!amount || !description) {
            return res.status(400).json({ error: 'Amount and description are required.' });
        }

        // Ensure positive amount for income
        const positiveAmount = Math.abs(parseFloat(amount));

        const transaction = await TransactionModel.create({
            amount: positiveAmount,
            description,
            category: category || 'Income',
            type: 'income',
            date: new Date()
        });

        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get balance information
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

        const transactions = await TransactionModel.find(filter);

        let totalIncome = 0;
        let totalExpenses = 0;

        transactions.forEach(tx => {
            // Check both type field and category for backward compatibility
            const isIncome = tx.type === 'income' ||
                tx.category?.toLowerCase().includes('income') ||
                tx.category?.toLowerCase().includes('profit');

            if (isIncome) {
                totalIncome += Math.abs(tx.amount);
            } else {
                totalExpenses += Math.abs(tx.amount);
            }
        });

        const balance = totalIncome - totalExpenses;

        res.json({
            filterType: date && date.toLowerCase() === 'today' ? 'today' : 'lifetime',
            totalIncome,
            totalExpenses,
            balance,
            status: balance >= 0 ? 'profit' : 'loss'
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get transactions by specific date
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

        // Filter by transaction type if specified
        if (type) {
            if (type.toLowerCase() === 'expense') {
                filter.type = 'expense';
            } else if (type.toLowerCase() === 'income') {
                filter.type = 'income';
            }
        }

        const transactions = await TransactionModel.find(filter).sort({ date: -1 });
        res.json(transactions);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
