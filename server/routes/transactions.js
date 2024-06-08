const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

// Configurar limitadores de tasa
const transactionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 solicitudes por ventana de tiempo por IP
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// Obtener todas las transacciones del usuario
router.get('/', auth, transactionsLimiter, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (err) {
    console.error(err); // Log del error en el servidor
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Crear una nueva transacción
router.post('/', auth, transactionsLimiter, async (req, res) => {
  const { description, amount } = req.body;

  try {
    const newTransaction = new Transaction({
      userId: req.user.userId,
      description,
      amount,
    });

    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    console.error(err); // Log del error en el servidor
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Eliminar una transacción
router.delete('/:id', auth, transactionsLimiter, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.userId.toString() !== req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction removed' });
  } catch (err) {
    console.error(err); // Log del error en el servidor
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
