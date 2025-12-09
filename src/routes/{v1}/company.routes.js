const express = require('express');

const router = express.Router();
const { body, param, query } = require('express-validator');

// Middleware de autenticación y autorización
const authenticate = require('../../middleware/auth.middleware');
const authorize = require('../../middleware/auth.middleware');
const validate = require('../../middleware/validation.middleware');

// Importar controlador
const companyController = require('../../controllers/company.controller');

// Validaciones comunes
const companyValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la empresa es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('El teléfono debe tener 10 dígitos'),
];

const idValidation = [
  param('id').isUUID().withMessage('ID inválido'),
];

// GET /companies - Listar empresas (público o protegido según requisitos)
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().trim(),
  validate,
  companyController.getAllCompanies,
);

// GET /companies/:id - Obtener empresa específica
router.get(
  '/:id',
  idValidation,
  validate,
  companyController.getCompanyById,
);

// POST /companies - Crear empresa (solo ADMIN)
router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  companyValidation,
  validate,
  companyController.createCompany,
);

// PUT /companies/:id - Actualizar empresa (solo ADMIN)
router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  idValidation,
  companyValidation,
  validate,
  companyController.updateCompany,
);

// DELETE /companies/:id - Eliminar empresa (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  idValidation,
  validate,
  companyController.deleteCompany,
);

// Rutas adicionales útiles
// GET /companies/:id/employees - Listar empleados de una empresa
router.get(
  '/:id/employees',
  idValidation,
  validate,
  companyController.getCompanyEmployees,
);

// GET /companies/:id/events - Listar eventos de una empresa
router.get(
  '/:id/events',
  idValidation,
  validate,
  companyController.getCompanyEvents,
);

module.exports = router;
