const jwt = require('jsonwebtoken');

const { Employee, Company } = require('../models');

const generateToken = (user) => jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' },
);
const register = async (data) => {
  const {
    name, email, password, companyName, companyId, role,
  } = data;

  // Verificar si el usuario ya existe
  const existingEmployee = await Employee.findOne({ where: { email } });
  if (existingEmployee) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 400;
    throw error;
  }

  let targetCompanyId = companyId;

  // Si se proporciona nombre de empresa, crearla (para registro inicial de ADMIN)
  if (companyName && !companyId) {
    const existingCompany = await Company.findOne({ where: { name: companyName } });
    if (existingCompany) {
      const error = new Error('La empresa ya existe');
      error.statusCode = 400;
      throw error;
    }
    const newCompany = await Company.create({
      name: companyName,
      email, // Email de contacto inicial
    });
    targetCompanyId = newCompany.id;
  }

  if (!targetCompanyId) {
    const error = new Error('ID de empresa o nombre de empresa requerido');
    error.statusCode = 400;
    throw error;
  }

  // Crear empleado
  const employee = await Employee.create({
    name,
    email,
    password,
    role: data.role || 'EMPLOYEE',
    companyId: targetCompanyId,
  });

  // Generar token
  const token = generateToken(employee);

  // Obtener el nombre de la compañía
  const company = await Company.findByPk(targetCompanyId, { attributes: ['name'] });

  return {
    user: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      companyId: employee.companyId,
      companyName: company?.name || 'Sin empresa',
    },
    token,
  };
};
//obtenemos el nombre de la empresa al loguearse 
const login = async (email, password) => {
  // Incluir la relación con Company para obtener el nombre
  const employee = await Employee.findOne({
    where: { email },
    include: [{ model: Company, as: 'company', attributes: ['name'] }],
  });

  if (!employee) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await employee.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(employee);

  return {
    user: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      companyId: employee.companyId,
      companyName: employee.company?.name || 'Sin empresa',
    },
    token,
  };
};

const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findByPk(decoded.userId);

    if (!employee) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 401;
      throw error;
    }

    const newToken = generateToken(employee);
    return { token: newToken };
  } catch (err) {
    const error = new Error('Token inválido o expirado');
    error.statusCode = 401;
    throw error;
  }
};

module.exports = {
  register,
  login,
  refreshToken,
};
