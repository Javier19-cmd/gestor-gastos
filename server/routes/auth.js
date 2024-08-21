const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const crypto = require('crypto-js');

const router = express.Router();

// Configurar limitadores de tasa
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita a 5 solicitudes por ventana de tiempo por IP
  message: "Too many accounts created from this IP, please try again after 15 minutes"
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Limita a 5 solicitudes por ventana de tiempo por IP
  message: "Too many login attempts from this IP, please try again after 15 minutes"
});

const secretKey = process.env.SECRET_KEY;

function decrypt(ciphertext) {
  try {
    const bytes = crypto.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(crypto.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error("Error during decryption:", error);
    throw new Error("Decryption failed");
  }
}

// Registro
router.post('/register', registerLimiter, async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  let decryptedPassword;
  let decryptedConfirmPassword;
  try {
    decryptedPassword = decrypt(password);
    decryptedConfirmPassword = decrypt(confirmPassword);
  } catch (error) {
    return res.status(500).json({ message: "Error decrypting password" });
  }

  if (decryptedPassword !== decryptedConfirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log para verificar la entrada
    //console.log('Login attempt:', { email, encryptedPassword: password });

    // Intentar descifrar la contraseña
    let decryptedPassword;
    try {
      decryptedPassword = decrypt(password);
      //console.log('Decrypted password:', decryptedPassword);
    } catch (decryptionError) {
      //console.error('Error during decryption:', decryptionError);
      return res.status(500).json({ message: "Error decrypting password" });
    }

    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) {
      //console.log('Invalid credentials: user not found');
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);
    if (!isMatch) {
      //console.log('Invalid credentials: password mismatch');
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    //console.log('Generated JWT token:', token);

    // Enviar respuesta exitosa
    res.json({ token });
  } catch (error) {
    //console.error('Server error during login:', error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
