const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Obtener estadísticas de transacciones
router.get('/summary', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });

    // Calcular el total de transacciones y el total de montos
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

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

    const monthlyStats = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[yearMonth]) {
        acc[yearMonth] = { count: 0, total: 0 };
      }
      acc[yearMonth].count += 1;
      acc[yearMonth].total += transaction.amount;
      return acc;
    }, {});

    res.json(monthlyStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
