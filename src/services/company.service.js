const { Company, Employee, Event } = require('../models');

const create = async (data) => {
  const { name, email, phone } = data;

  const existingCompany = await Company.findOne({ where: { name } });
  if (existingCompany) {
    const error = new Error('La empresa ya existe');
    error.statusCode = 400;
    throw error;
  }

  const company = await Company.create({
    name,
    email,
    phone,
  });

  return company;
};

const getAll = async (page = 1, limit = 10, search = '') => {
  const offset = (page - 1) * limit;
  const where = {};

  if (search) {
    // Simple search implementation
    // In a real app, use Op.iLike or similar
  }

  const { count, rows } = await Company.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    companies: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalItems: count,
  };
};

const getById = async (id) => {
  const company = await Company.findByPk(id, {
    include: [
      { model: Employee, as: 'employees', attributes: ['id', 'name', 'email', 'role'] },
      { model: Event, as: 'events', attributes: ['id', 'title', 'date'] },
    ],
  });

  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }

  return company;
};

const update = async (id, data) => {
  const company = await Company.findByPk(id);

  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }

  await company.update(data);
  return company;
};

const deleteCompany = async (id) => {
  const company = await Company.findByPk(id);

  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }

  await company.destroy();
  return { message: 'Empresa eliminada correctamente' };
};

const getCompanyEmployees = async (id) => {
  const company = await Company.findByPk(id);
  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }
  const employees = await Employee.findAll({ where: { companyId: id } });
  return employees;
};

const getCompanyEvents = async (id) => {
  const company = await Company.findByPk(id);
  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }
  const events = await Event.findAll({ where: { companyId: id } });
  return events;
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteCompany,
  getCompanyEmployees,
  getCompanyEvents,
};
