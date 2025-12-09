const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/v1');

require('dotenv').config();

const app = express();

// Configuración de seguridad con Helmet
app.use(helmet());

// Configurar CORS
const allowedOrigins = [
  'http://localhost:3000',//Backend
  'http://localhost:3001', //Backend
  'http://localhost:5173', // Frontend
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    //aceptar peticiones sin origen (como apps moviles o peticiones curl)
    if (!origin) return callback(null, true);
    //aceptar peticiones de los origenes permitidos
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));// en caso de no estar en la lista de origenes permitidos
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], //metodos aceptados
  allowedHeaders: ['Content-Type', 'Authorization'], //con bearer
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP',
    retryAfter: '15 minutos',
  },
});
app.use('/api', limiter);

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Montar rutas API en /api
app.use('/api', routes);

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    suggested: '/api para ver endpoints disponibles',
  });
});

// Middleware de manejo de errores global
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    timestamp: new Date().toISOString(),
  });
});
module.exports = app;

// test
// Agrega esto temporalmente en app.js para debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
