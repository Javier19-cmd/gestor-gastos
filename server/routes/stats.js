const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Obtener estadísticas de transacciones
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    // Cálculo del total de montos para ingresos y gastos
    const totalIncome = transactions.filter(transaction => transaction.type === 'income').reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpense = transactions.filter(transaction => transaction.type === 'expense').reduce((acc, transaction) => acc + transaction.amount, 0);

    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Obtener estadísticas mensuales
router.get('/monthly', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    const monthlyStats = transactions.reduce((acc, transaction) => {
      const month = `${transaction.date.getFullYear()}-${transaction.date.getMonth() + 1}`;
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc[month].expense += transaction.amount;
      }
      return acc;
    }, {});

    res.json(monthlyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
