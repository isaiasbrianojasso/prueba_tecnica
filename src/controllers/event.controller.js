const eventService = require('../services/event.service');

const createEvent = async (req, res, next) => {
  try {
    const eventData = {
      ...req.body,
      companyId: req.user.companyId,
    };
    const event = await eventService.create(eventData);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const {
      page, limit, companyId, dateFrom, dateTo, upcoming,
    } = req.query;

    let cid = companyId;
    if (req.user && req.user.role !== 'ADMIN') {
      cid = req.user.companyId;
    }

    const filters = {
      companyId: cid, dateFrom, dateTo, upcoming,
    };
    const result = await eventService.getAll(page, limit, filters);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getById(req.params.id);

    // validar acceso
    if (req.user && req.user.role !== 'ADMIN') {
      if (event.companyId !== req.user.companyId) {
        const err = new Error('Acceso denegado');
        err.statusCode = 403;
        throw err;
      }
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.update(req.params.id, req.body);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const result = await eventService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};
