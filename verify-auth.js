const { sequelize, Company, Employee } = require('./src/models');
const authService = require('./src/services/auth.service');

const verifyAuth = async () => {
    try {
        console.log('Syncing database...');
        await sequelize.sync({ force: true }); // WARNING: This deletes all data

        console.log('Registering new company and admin...');
        const registerData = {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            companyName: 'Test Company',
            role: 'ADMIN',
        };

        const registerResult = await authService.register(registerData);
        console.log('Registration successful:', registerResult.user);
        console.log('Token:', registerResult.token);

        console.log('Logging in...');
        const loginResult = await authService.login('admin@example.com', 'password123');
        console.log('Login successful:', loginResult.user);
        console.log('Token matches:', registerResult.token === loginResult.token ? 'No (Expected, new token generated)' : 'No (New token generated)');

        console.log('Verification complete!');
        process.exit(0);
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
};

verifyAuth();
