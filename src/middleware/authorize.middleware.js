const authorize = (allowedRoles = []) => {
  const roles = typeof allowedRoles === 'string' ? [allowedRoles] : allowedRoles;

  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Debe iniciar sesion',
      });
    }

    // Verificar si el usuario es admin
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        message: `No tiene permisos para realizar esta acción. Rol requerido: ${roles.join(', ')}`,
        yourRole: req.user.role,
      });
    }

    return next();
  };
};

// Middleware para verificar propiedad del recurso
const isOwnerOrAdmin = (resourceOwnerIdField = 'userId') => (req, res, next) => {
  // Si es ADMIN, permitir acceso
  if (req.user.role === 'ADMIN') {
    return next();
  }


  const resourceOwnerId = req.params[resourceOwnerIdField] || req.body[resourceOwnerIdField];

  if (req.user.id === resourceOwnerId) {
    return next();
  }

  return res.status(403).json({
    error: 'Acceso denegado',
    message: 'Solo puede modificar sus propios recursos',
  });
};

module.exports = { authorize, isOwnerOrAdmin };
