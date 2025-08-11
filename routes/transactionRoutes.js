const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Specific routes first (order matters!)
router.post('/income-today', transactionController.addTodayIncome);
router.get('/balance', transactionController.getBalance);
router.get('/date', transactionController.getTransactionsByDate);

// CRUD routes
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;