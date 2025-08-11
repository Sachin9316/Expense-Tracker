const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
});
const TransactionModel = mongoose.model('Transaction', transactionSchema);
module.exports = TransactionModel;