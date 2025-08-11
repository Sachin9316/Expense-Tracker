const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount must be positive']
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        default: 'expense'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Index for better query performance
transactionSchema.index({ date: -1, type: 1 });

const TransactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = TransactionModel;