const companyService = require('../services/company.service');

const createCompany = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body);
    res.status(201).json(company);
  } catch (error) {
    next(error);
  }
};

const getAllCompanies = async (req, res, next) => {
  try {
    const { page, limit, search } = req.query;
    const result = await companyService.getAll(page, limit, search);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await companyService.getById(req.params.id);
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const company = await companyService.update(req.params.id, req.body);
    res.status(200).json(company);
  } catch (error) {
    next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const result = await companyService.delete(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getCompanyEmployees = async (req, res, next) => {
  try {
    const employees = await companyService.getCompanyEmployees(req.params.id);
    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

const getCompanyEvents = async (req, res, next) => {
  try {
    const events = await companyService.getCompanyEvents(req.params.id);
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getCompanyEmployees,
  getCompanyEvents,
};
