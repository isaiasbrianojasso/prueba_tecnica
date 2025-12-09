const { EventRegistration, Event, Employee } = require('../models');

const registerForEvent = async (eventId, employeeId) => {
  const event = await Event.findByPk(eventId);
  if (!event) {
    const error = new Error('Evento no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const employee = await Employee.findByPk(employeeId);
  if (!employee) {
    const error = new Error('Empleado no encontrado');
    error.statusCode = 404;
    throw error;
  }

  const existingRegistration = await EventRegistration.findOne({
    where: { eventId, employeeId },
  });

  if (existingRegistration) {
    const error = new Error('El empleado ya está registrado en este evento');
    error.statusCode = 400;
    throw error;
  }

  const registration = await EventRegistration.create({
    eventId,
    employeeId,
  });

  return registration;
};

const getEventAttendees = async (eventId, page = 1, limit = 10, checkedIn = undefined) => {
  const offset = (page - 1) * limit;
  const where = { eventId };

  if (checkedIn !== undefined) {
    where.checkedIn = checkedIn;
  }

  const { count, rows } = await EventRegistration.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      {
        model: Employee,
        as: 'employee', // Note: Check association alias in index.js
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return {
    attendees: rows,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalItems: count,
  };
};

const checkInAttendee = async (eventId, registrationId) => {
  const registration = await EventRegistration.findOne({
    where: { id: registrationId, eventId },
  });

  if (!registration) {
    const error = new Error('Registro no encontrado');
    error.statusCode = 404;
    throw error;
  }

  if (registration.checkedIn) {
    const error = new Error('El asistente ya ha realizado check-in');
    error.statusCode = 400;
    throw error;
  }

  await registration.update({
    checkedIn: true,
    checkedInAt: new Date(),
  });

  return registration;
};

const cancelRegistration = async (eventId, registrationId) => {
  const registration = await EventRegistration.findOne({
    where: { id: registrationId, eventId },
  });

  if (!registration) {
    const error = new Error('Registro no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await registration.destroy();
  return { message: 'Registro cancelado correctamente' };
};

const getMyRegistration = async (eventId, employeeId) => {
  const registration = await EventRegistration.findOne({
    where: { eventId, employeeId },
  });

  if (!registration) {
    const error = new Error('No estás registrado en este evento');
    error.statusCode = 404;
    throw error;
  }

  return registration;
};

module.exports = {
  registerForEvent,
  getEventAttendees,
  checkInAttendee,
  cancelRegistration,
  getMyRegistration,
};
