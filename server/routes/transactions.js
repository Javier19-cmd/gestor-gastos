const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Configuración del rate limiter para las diferentes rutas
const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 peticiones por ventana de tiempo por IP
  message: 'Too many requests to get transactions, please try again after 15 minutes'
});

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita a 50 peticiones por ventana de tiempo por IP
  message: 'Too many requests to add transactions, please try again after 15 minutes'
});

const deleteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 2, // Limita a 20 peticiones por ventana de tiempo por IP
  message: 'Too many requests to delete transactions, please try again after 15 minutes'
});

// Obtener todas las transacciones del usuario con rate limiter
router.get('/', auth, getLimiter, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Crear una nueva transacción con rate limiter
router.post('/', auth, postLimiter, async (req, res) => {
  const { description, amount, type } = req.body;

  try {
    const newTransaction = new Transaction({
      userId: req.user.userId,
      description,
      amount: parseFloat(amount),
      type,
    });

    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    console.error('Error adding transaction:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Eliminar una transacción con rate limiter
router.delete('/:id', auth, deleteLimiter, async (req, res) => {
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
    console.error('Error deleting transaction:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
