const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar y sincronizar la base de datos
    await db.sequelize.authenticate();
    // console.log(' Conexión a PostgreSQL establecida correctamente.');

    // Sincronizar modelos (crear tablas si no existen)
    await db.sequelize.sync({ alter: true });
    //console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════════════╗
║      API de Gestión de Eventos            ║
╠═══════════════════════════════════════════╣
║  Entorno: ${ENVIRONMENT.padEnd(20)}       ║
║  Servidor: http://localhost:${PORT}       ║
║ Iniciado: ${new Date().toLocaleString()}  ║
╚═══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre elegante
process.on('SIGTERM', () => {
  console.log(' SIGTERM recibido. Cerrando servidor...');
  // await closeDatabase();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(' SIGINT recibido. Cerrando servidor...');
  // await closeDatabase();
  process.exit(0);
});

// Iniciar servidor
startServer();
