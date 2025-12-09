const express = require('express');

const router = express.Router();
const { body, param, query } = require('express-validator');

// Middleware
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/authorize.middleware');
const validate = require('../middleware/validation.middleware');

// Controlador
const employeeController = require('../controllers/employee.controller');

// Validaciones
const employeeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('companyId')
    .isUUID()
    .withMessage('ID de empresa inválido'),
  body('role')
    .isIn(['ADMIN', 'EMPLOYEE'])
    .withMessage('Rol inválido. Valores permitidos: ADMIN, EMPLOYEE')
];

const updateEmployeeValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacío')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'EMPLOYEE'])
    .withMessage('Rol inválido. Valores permitidos: ADMIN, EMPLOYEE')
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

// GET /employees - Listar empleados (solo ADMIN o empleados de misma empresa)
router.get(
  '/',
  authenticate,
  authorize(['ADMIN']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('companyId').optional().isUUID(),
  query('role').optional().isIn(['ADMIN', 'EMPLOYEE']),
  validate,
  employeeController.getAllEmployees,
);

// GET /employees/:id - Obtener empleado específico
router.get(
  '/:id',
  authenticate,
  idValidation,
  validate,
  employeeController.getEmployeeById,
);

// POST /employees - Crear empleado (solo ADMIN)
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  employeeValidation,
  validate,
  employeeController.createEmployee,
);

// PUT /employees/:id - Actualizar empleado (propio usuario o ADMIN)
router.put(
  '/:id',
  authenticate,
  idValidation,
  updateEmployeeValidation,
  validate,
  employeeController.updateEmployee,
);

// DELETE /employees/:id - Eliminar empleado (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  idValidation,
  validate,
  employeeController.deleteEmployee,
);

// Rutas adicionales
// GET /employees/:id/events - Eventos a los que está registrado el empleado
router.get(
  '/:id/events',
  authenticate,
  idValidation,
  validate,
  employeeController.getEmployeeEvents,
);

// GET /employees/:id/registrations - Registros del empleado
router.get(
  '/:id/registrations',
  authenticate,
  idValidation,
  validate,
  employeeController.getEmployeeRegistrations,
);

module.exports = router;
