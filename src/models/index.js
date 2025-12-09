const { Sequelize } = require('sequelize');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const config = require('../../sequelize.config.js')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

// Importar modelos
db.Company = require('./company.model')(sequelize);
db.Employee = require('./employee.model')(sequelize);
db.Event = require('./event.model')(sequelize);
db.EventRegistration = require('./eventRegistration.model')(sequelize);

// Definir asociaciones
// Company - Employee (1:N)
db.Company.hasMany(db.Employee, { foreignKey: 'companyId', as: 'employees' });
db.Employee.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });

// Company - Event (1:N)
db.Company.hasMany(db.Event, { foreignKey: 'companyId', as: 'events' });
db.Event.belongsTo(db.Company, { foreignKey: 'companyId', as: 'company' });

// Event - Employee (N:M a través de EventRegistration)
db.Event.belongsToMany(db.Employee, { through: db.EventRegistration, foreignKey: 'eventId', as: 'attendees' });
db.Employee.belongsToMany(db.Event, { through: db.EventRegistration, foreignKey: 'employeeId', as: 'registeredEvents' });

// Relaciones directas con EventRegistration para consultas más detalladas
db.Event.hasMany(db.EventRegistration, { foreignKey: 'eventId', as: 'registrations' });
db.EventRegistration.belongsTo(db.Event, { foreignKey: 'eventId', as: 'event' });

db.Employee.hasMany(db.EventRegistration, { foreignKey: 'employeeId', as: 'eventRegistrations' });
db.EventRegistration.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
