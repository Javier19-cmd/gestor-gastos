const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Obtener estadísticas de transacciones
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    // Cálculo del total de transacciones y el total de montos para gastos
    const filteredTransactions = transactions.filter(transaction => transaction.amount < 0);
    const totalTransactions = filteredTransactions.length;
    const totalAmount = filteredTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    res.json({ totalTransactions, totalAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Obtener estadísticas mensuales
router.get('/monthly', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    console.log("Transactions: ", transactions)

    const monthlyStats = transactions.reduce((acc, transaction) => {
      if (transaction.amount >= 0) return acc;

      const month = `${transaction.date.getFullYear()}-${transaction.date.getMonth() + 1}`;
      if (!acc[month]) {
        acc[month] = { count: 0, total: 0 };
      }
      acc[month].count += 1;
      acc[month].total += transaction.amount;
      return acc;
    }, {});

    res.json(monthlyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
