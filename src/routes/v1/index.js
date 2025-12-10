const express = require('express');
const authRoutes = require('./auth.routes');
const companyRoutes = require('./company.routes');
const employeeRoutes = require('./employee.routes');
const eventRoutes = require('./event.routes');
const registrationRoutes = require('./eventRegistration.routes');

const router = express.Router();

// Ruta de bienvenida /muestra todas a las api disposnible 
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Endpoints',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrar nuevo usuario',
        'POST /api/auth/login': 'Iniciar sesión',
        'POST /api/auth/refresh-token': 'Renovar token',
        'POST /api/auth/logout': 'Cerrar sesión',
      },
      companies: {
        'GET /api/companies': 'Listar empresas',
        'GET /api/companies/:id': 'Obtener empresa por ID',
        'POST /api/companies': 'Crear empresa (ADMIN)',
        'PUT /api/companies/:id': 'Actualizar empresa (ADMIN)',
        'DELETE /api/companies/:id': 'Eliminar empresa (ADMIN)',
      },
      employees: {
        'GET /api/employees': 'Listar empleados',
        'GET /api/employees/:id': 'Obtener empleado por ID',
        'POST /api/employees': 'Crear empleado (ADMIN)',
        'PUT /api/employees/:id': 'Actualizar empleado',
        'DELETE /api/employees/:id': 'Eliminar empleado (ADMIN)',
      },
      events: {
        'GET /api/events': 'Listar eventos',
        'GET /api/events/:id': 'Obtener evento por ID',
        'POST /api/events': 'Crear evento (ADMIN)',
        'PUT /api/events/:id': 'Actualizar evento (ADMIN)',
        'DELETE /api/events/:id': 'Eliminar evento (ADMIN)',
      },
      registrations: {
        'POST /api/events/:id/register': 'Registrarse a un evento',
        'GET /api/events/:id/attendees': 'Listar asistentes de un evento',
      },
    },
  });
});

// Montar todas las rutas
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/employees', employeeRoutes);
router.use('/events', eventRoutes);
router.use('/events', registrationRoutes); // Rutas de registros (anidadas en eventos)

module.exports = router;
