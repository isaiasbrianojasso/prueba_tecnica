const express = require('express');

const router = express.Router();

const { body } = require('express-validator');

// Controlador de autenticación
const authController = require('../../controllers/auth.controller');
const validate = require('../../middleware/validation.middleware');

// Validaciones para registro
const registerValidation = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('companyId').optional().isUUID().withMessage('ID de empresa inválido'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'EMPLOYEE'])
    .withMessage('Rol inválido. Valores permitidos: ADMIN, EMPLOYEE'),
];

// Validaciones para login
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
];

// Endpoints públicos
router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh-token', authController.refreshToken);

// Endpoints protegidos
router.post('/logout', authController.logout); // Requiere token
router.get('/me', authController.getCurrentUser); // Obtener usuario actual

module.exports = router;
