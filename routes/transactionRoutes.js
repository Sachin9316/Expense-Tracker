const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Specific routes first
router.post('/income-today', transactionController.addTodayIncome);
router.get('/balance', transactionController.getBalance);

// CRUD routes
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;