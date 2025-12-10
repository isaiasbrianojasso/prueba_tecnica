const { Op } = require('sequelize');
const {
  Event, Company,
} = require('../models');

const create = async (data) => {
  const {
    title, description, date, companyId,
  } = data;

  const company = await Company.findByPk(companyId);
  if (!company) {
    const error = new Error('Empresa no encontrada');
    error.statusCode = 404;
    throw error;
  }

  const event = await Event.create({
    title,
    description,
    date,
    companyId,
  });

  return event;
};

const getAll = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;
  const where = {};

  if (filters.companyId) where.companyId = filters.companyId;
  if (filters.dateFrom) where.date = { [Op.gte]: filters.dateFrom };
  if (filters.dateTo) where.date = { ...where.date, [Op.lte]: filters.dateTo };
  if (filters.upcoming) where.date = { [Op.gte]: new Date() };

  const { count, rows } = await Event.findAndCountAll({
    where,
    limit,
    offset,
    include: [{ model: Company, as: 'company', attributes: ['id', 'name'] }],
    order: [['date', 'ASC']],
  });

  return {
    events: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalItems: count,
  };
};

const getById = async (id) => {
  const event = await Event.findByPk(id, {
    include: [
      { model: Company, as: 'company', attributes: ['id', 'name'] },
    ],
  });

  if (!event) {
    const error = new Error('Evento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  return event;
};

const update = async (id, data) => {
  const event = await Event.findByPk(id);

  if (!event) {
    const error = new Error('Evento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await event.update(data);
  return event;
};

const deleteEvent = async (id) => {
  const event = await Event.findByPk(id);

  if (!event) {
    const error = new Error('Evento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await event.destroy();
  return { message: 'Evento eliminado correctamente' };
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteEvent,
};
