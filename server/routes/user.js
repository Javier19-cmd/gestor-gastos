const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Asegúrate de importar el modelo Transaction
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Configuración del rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Aplicar el rate limiter a todas las rutas de este router
router.use(limiter);

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.userId}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Cambiar contraseña
router.put('/password', auth, async (req, res) => {
  const { password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(req.user.userId, { password: hashedPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Subir foto de perfil
router.post('/profile-picture', auth, upload.single('profilePicture'), (req, res) => {
  try {
    res.json({ message: 'Profile picture uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Eliminar cuenta
router.delete('/', auth, async (req, res) => {
  try {
    // Eliminar transacciones asociadas al usuario
    await Transaction.deleteMany({ userId: req.user.userId });
    
    // Eliminar el usuario
    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: 'Account and all related data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
