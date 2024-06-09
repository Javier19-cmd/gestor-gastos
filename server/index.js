const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas de transacciones
const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

// Rutas de estadísticas
const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

// Rutas de usuarios
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);


// Ruta por defecto
app.use("/", (req, res) => {
  res.send("Server is running.");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
