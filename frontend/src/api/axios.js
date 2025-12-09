import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 (Unauthorized) - Optional: Refresh token logic here
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // window.location.href = '/login'; // Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
