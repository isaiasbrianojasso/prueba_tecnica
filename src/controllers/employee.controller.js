const employeeService = require('../services/employee.service');

const createEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

const getAllEmployees = async (req, res, next) => {
  try {
    const {
      page, limit, companyId, role,
    } = req.query;
    // If user is not ADMIN, force companyId to their own company
    const filterCompanyId = req.user.role === 'ADMIN' ? companyId : req.user.companyId;

    const result = await employeeService.getAll(filterCompanyId, role, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await employeeService.getById(req.params.id);
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await employeeService.update(req.params.id, req.body);
    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const result = await employeeService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getEmployeeEvents = async (req, res, next) => {
  try {
    const events = await employeeService.getEmployeeEvents(req.params.id);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

const getEmployeeRegistrations = async (req, res, next) => {
  try {
    const registrations = await employeeService.getEmployeeRegistrations(req.params.id);
    res.status(200).json(registrations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeEvents,
  getEmployeeRegistrations,
};
