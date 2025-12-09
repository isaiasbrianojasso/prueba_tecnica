const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/{v1}');

require('dotenv').config();

const app = express();

// Configuración de seguridad con Helmet
app.use(helmet());

// Configurar CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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

// Ruta de prueba/health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
});

// Middleware de manejo de errores global
app.use((err, req, res) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        timestamp: new Date().toISOString(),
    });
});

// Montar rutas API en /api
app.use('/api', routes);

// Manejo de rutas no encontradas (mantener al final)
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        suggested: '/api para ver endpoints disponibles'
    });
});
module.exports = app;

//test
// Agrega esto temporalmente en app.js para debug
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
