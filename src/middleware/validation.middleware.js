const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(400).json({
      error: 'Error de validación',
      details: errorMessages,
      timestamp: new Date().toISOString(),
    });
  }

  return next();
};

module.exports = validate;
