const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    // console.log(' Conexión a PostgreSQL establecida correctamente.');
    //crear tablas si no existen
    await db.sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log('corriendo');
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};


// Iniciar servidor
startServer();
