const registrationService = require('../services/registration.service');

const registerForEvent = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { id: employeeId } = req.user; // Assuming user is attached to req by auth middleware
    const registration = await registrationService.registerForEvent(eventId, employeeId);
    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

const getEventAttendees = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { page, limit, checkedIn } = req.query;
    const result = await registrationService.getEventAttendees(eventId, page, limit, checkedIn);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const checkInAttendee = async (req, res, next) => {
  try {
    const { id: eventId, registrationId } = req.params;
    const registration = await registrationService.checkInAttendee(eventId, registrationId);
    res.status(200).json(registration);
  } catch (error) {
    next(error);
  }
};

const cancelRegistration = async (req, res, next) => {
  try {
    const { id: eventId, registrationId } = req.params;
    const result = await registrationService.cancelRegistration(eventId, registrationId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getMyRegistration = async (req, res, next) => {
  try {
    const { id: eventId } = req.params;
    const { id: employeeId } = req.user;
    const registration = await registrationService.getMyRegistration(eventId, employeeId);
    res.status(200).json(registration);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  getEventAttendees,
  checkInAttendee,
  cancelRegistration,
  getMyRegistration,
};
