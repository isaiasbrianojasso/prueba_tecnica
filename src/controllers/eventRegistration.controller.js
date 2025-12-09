const express = require('express');

const router = express.Router({ mergeParams: true }); // mergeParams permite acceder a :id del router padre
const { body, param, query } = require('express-validator');

// Middleware
const authenticate = require('../middleware/auth.middleware');
const validate = require('../middleware/validation.middleware');

// Controlador
const registrationController = require('../controllers/registrations.controller');

// Validaciones
const idValidation = [
  param('id').isUUID().withMessage('ID de evento inválido'),
];

const registrationValidation = [
  body('employeeId')
    .optional()
    .isUUID()
    .withMessage('ID de empleado inválido'),
];

// POST /events/:id/register - Registrarse a un evento
router.post(
  '/:id/register',
  authenticate,
  idValidation,
  registrationValidation,
  validate,
  registrationController.registerForEvent,
);

// GET /events/:id/attendees - Listar asistentes de un evento
router.get(
  '/:id/attendees',
  authenticate,
  idValidation,
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('checkedIn').optional().isBoolean(),
  validate,
  registrationController.getEventAttendees,
);

// PATCH /events/:id/check-in/:registrationId - Marcar asistencia
router.patch(
  '/:id/check-in/:registrationId',
  authenticate,
  param('registrationId').isUUID().withMessage('ID de registro inválido'),
  idValidation,
  validate,
  registrationController.checkInAttendee,
);

// DELETE /events/:id/unregister/:registrationId - Cancelar registro
router.delete(
  '/:id/unregister/:registrationId',
  authenticate,
  param('registrationId').isUUID().withMessage('ID de registro inválido'),
  idValidation,
  validate,
  registrationController.cancelRegistration,
);

// GET /events/:id/my-registration - Ver mi registro al evento
router.get(
  '/:id/my-registration',
  authenticate,
  idValidation,
  validate,
  registrationController.getMyRegistration,
);

module.exports = router;
