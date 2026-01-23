import api from './api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/seller/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/seller/auth/logout');
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/seller/auth/me');
        return response.data;
    },

    refreshToken: async () => {
        const response = await api.post('/seller/auth/refresh');
        return response.data;
    },
};
