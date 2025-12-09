const express = require('express');

const router = express.Router();
const { body, param, query } = require('express-validator');

// Middleware
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validate = require('../middleware/validation.middleware');

// Controlador
const eventController = require('../controllers/events.controller');

// Validaciones
const eventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  body('description')
    .trim()
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('date')
    .isISO8601()
    .withMessage('Fecha inválida. Use formato ISO 8601'),
  body('companyId')
    .isUUID()
    .withMessage('ID de empresa inválido')
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El título no puede estar vacío')
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Fecha inválida. Use formato ISO 8601')
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido')
];

// GET /events - Listar eventos (público o autenticado)
router.get(
  '/',
  authenticate,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('companyId').optional().isUUID(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('upcoming').optional().isBoolean(),
  validate,
  eventController.getAllEvents
);

// GET /events/:id - Obtener evento específico
router.get(
  '/:id',
  authenticate,
  idValidation,
  validate,
  eventController.getEventById
);

// POST /events - Crear evento (solo ADMIN)
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  eventValidation,
  validate,
  eventController.createEvent
);

// PUT /events/:id - Actualizar evento (solo ADMIN)
router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  idValidation,
  updateEventValidation,
  validate,
  eventController.updateEvent
);

// DELETE /events/:id - Eliminar evento (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  idValidation,
  validate,
  eventController.deleteEvent
);

module.exports = router;
