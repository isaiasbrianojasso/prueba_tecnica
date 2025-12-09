const eventService = require('../services/event.service');

const createEvent = async (req, res, next) => {
  try {
    // El ADMIN solo puede crear eventos para su propia empresa
    // Se ignora el companyId enviado en el body y se usa el del usuario autenticado
    const eventData = {
      ...req.body,
      companyId: req.user.companyId, // Forzar la empresa del usuario autenticado
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

    // Si el usuario no es ADMIN, forzar filtro por su propia empresa
    let filterCompanyId = companyId;
    if (req.user && req.user.role !== 'ADMIN') {
      filterCompanyId = req.user.companyId;
    }

    const filters = {
      companyId: filterCompanyId, dateFrom, dateTo, upcoming,
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

    // Si el usuario no es ADMIN, verificar que el evento pertenece a su empresa
    if (req.user && req.user.role !== 'ADMIN') {
      if (event.companyId !== req.user.companyId) {
        const error = new Error('No tienes permiso para ver este evento');
        error.statusCode = 403;
        throw error;
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
