const app = require('./app');

const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Función para iniciar el servidor
const startServer = async () => {
    try {
     // Aquí iría la conexión a la base de datos
        // await connectDatabase();
        app.listen(PORT, () => {
            console.log(`
╔═══════════════════════════════════════════╗
║      API de Gestión de Eventos            ║
╠═══════════════════════════════════════════╣
║  Entorno: ${ENVIRONMENT.padEnd(20)} ║
║  Servidor: http://localhost:${PORT}    ║
║  Health: http://localhost:${PORT}/health ║
║ Iniciado: ${new Date().toLocaleString()} ║
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
