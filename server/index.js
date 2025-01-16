const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const app = express();

// Lista de orígenes permitidos
const allowedOrigins = ['https://gestor-gastos-cliente.vercel.app', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Permite cookies y encabezados autorizados
  optionsSuccessStatus: 204, // Para solicitudes OPTIONS
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // Manejar solicitudes OPTIONS

// Eliminando encabezado X-Powered-By
app.disable('x-powered-by');

// Añadiendo encabezados de seguridad con helmet
app.use(helmet());
app.use(helmet.hsts({
  maxAge: 63072000,
  includeSubDomains: true,
  preload: true
}));
app.use(helmet.noSniff());

// Configuración de directivas de caché
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
});

app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

const statsRoutes = require('./routes/stats');
app.use('/api/stats', statsRoutes);

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
