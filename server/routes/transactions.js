const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Configurar el rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 peticiones por ventana por usuario
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Aplicar el rate limiter a todas las rutas
router.use(limiter);

// Obtener todas las transacciones del usuario
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId });
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Crear una nueva transacción
router.post('/', auth, async (req, res) => {
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

// Eliminar una transacción
router.delete('/:id', auth, async (req, res) => {
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
