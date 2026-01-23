import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh if the request itself was to an auth endpoint
        const isAuthEndpoint = originalRequest.url?.includes('/auth/me') ||
            originalRequest.url?.includes('/auth/refresh') ||
            originalRequest.url?.includes('/auth/logout');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                await api.post('/seller/auth/refresh');
                return api(originalRequest);
            } catch (refreshError) {
                // Don't redirect here - let the component handle it
                return Promise.reject(refreshError);
            }
        }

        // Normalize error message
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        error.message = message;

        return Promise.reject(error);
    }
);

export default api;
