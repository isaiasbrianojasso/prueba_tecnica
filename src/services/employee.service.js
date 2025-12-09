const { Employee, Company } = require('../models');

const create = async (data) => {
  const {
    name, email, password, companyId, role,
  } = data;

  const existingEmployee = await Employee.findOne({ where: { email } });
  if (existingEmployee) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.findByPk(companyId);
  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }

  const employee = await Employee.create({
    name,
    email,
    password, // Hook will hash it
    companyId,
    role: role || 'EMPLOYEE',
  });

  // Remove password from response
  const employeeData = employee.toJSON();
  delete employeeData.password;

  return employeeData;
};

const getAll = async (companyId, role, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (companyId) where.companyId = companyId;
  if (role) where.role = role;

  const { count, rows } = await Employee.findAndCountAll({
    where,
    limit,
    offset,
    attributes: { exclude: ['password'] },
    include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    order: [['createdAt', 'DESC']],
  });

  return {
    employees: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalItems: count,
  };
};

const getById = async (id) => {
  const employee = await Employee.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
  });

  if (!employee) {
    const error = new Error('Empleado no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return employee;
};

const update = async (id, data) => {
  const employee = await Employee.findByPk(id);

  if (!employee) {
    const error = new Error('Empleado no encontrado');
    error.statusCode = 404;
    throw error;
  }

  // Prevent changing company if not authorized logic handled in controller/middleware
  // Here we just update
  await employee.update(data);

  const updatedEmployee = employee.toJSON();
  delete updatedEmployee.password;

  return updatedEmployee;
};

const deleteEmployee = async (id) => {
  const employee = await Employee.findByPk(id);

  if (!employee) {
    const error = new Error('Empleado no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await employee.destroy();
  return { message: 'Empleado eliminado correctamente' };
};

const getEmployeeEvents = async () =>
  // This would require querying EventRegistration
  // For now, return not implemented or implement if models allow
  [];
const getEmployeeRegistrations = async () =>
  // This would require querying EventRegistration
  [];
module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEmployee,
  getEmployeeEvents,
  getEmployeeRegistrations,
};
