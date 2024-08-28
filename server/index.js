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
    // Permitir solicitudes sin origen (por ejemplo, Postman o scripts de servidor)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true); // Si el origen está en la lista permitida, permitir la solicitud
    } else {
      callback(new Error('Not allowed by CORS')); // Si no está permitido, devolver un error
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// // Esto maneja las solicitudes OPTIONS que forman parte de las peticiones preflight de CORS
// app.options('*', cors(corsOptions));

// Eliminando encabezado X-Powered-By
app.disable('x-powered-by');

// Añadiebdi encabezados de seguridad con helmet
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
