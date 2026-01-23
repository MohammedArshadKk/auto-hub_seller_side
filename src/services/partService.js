import api from './api';

/**
 * Part Service - Handles all part-related API calls
 */
export const partService = {
    /**
     * Search parts with filters and pagination
     * @param {string} query - Search query
     * @param {object} filters - Filter options (category, make, brand, year)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     */
    searchParts: async (query = '', filters = {}, page = 1, limit = 20) => {
        const params = new URLSearchParams({
            ...(query && { q: query }),
            ...(filters.category && { category: filters.category }),
            ...(filters.make && { make: filters.make }),
            ...(filters.brand && { brand: filters.brand }),
            ...(filters.year && { year: filters.year }),
            page: page.toString(),
            limit: limit.toString(),
        });

        const response = await api.get(`/parts/search?${params.toString()}`);
        return response.data;
    },

    /**
     * Get autocomplete suggestions
     * @param {string} query - Search query (min 2 characters)
     */
    getSuggestions: async (query) => {
        if (query.length < 2) return { data: { suggestions: [] } };
        const response = await api.get(`/parts/suggestions?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    /**
     * Get all categories
     */
    getCategories: async () => {
        const response = await api.get('/parts/categories');
        return response.data;
    },

    /**
     * Get all brands
     */
    getBrands: async () => {
        const response = await api.get('/parts/brands');
        return response.data;
    },

    /**
     * Get all vehicle makes
     */
    getMakes: async () => {
        const response = await api.get('/parts/vehicles/makes');
        return response.data;
    },

    /**
     * Get vehicle models for a specific make
     * @param {string} make - Vehicle make
     */
    getModels: async (make) => {
        if (!make) return { data: [] };
        const response = await api.get(`/parts/vehicles/models?make=${encodeURIComponent(make)}`);
        return response.data;
    },

    /**
     * Get part details by ID
     * @param {string} id - Part ID
     */
    getPartById: async (id) => {
        const response = await api.get(`/parts/${id}`);
        return response.data;
    },
};
