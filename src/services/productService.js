import api from './api';

/**
 * Product Service - Handles all product-related API calls
 */
export const productService = {
    /**
     * Create a new product
     * @param {object} productData - Product data
     */
    createProduct: async (productData) => {
        const response = await api.post('/products/seller', productData);
        return response.data;
    },

    /**
     * Get seller's products with filters
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} status - Filter by status (PENDING_APPROVAL, APPROVED, REJECTED)
     */
    getMyProducts: async (page = 1, limit = 20, status = null) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && { status }),
        });

        const response = await api.get(`/products/seller/my-products?${params.toString()}`);
        return response.data;
    },

    /**
     * Update a product
     * @param {string} id - Product ID
     * @param {object} data - Updated product data
     */
    updateProduct: async (id, data) => {
        const response = await api.patch(`/products/seller/${id}`, data);
        return response.data;
    },

    /**
     * Delete a product
     * @param {string} id - Product ID
     */
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/seller/${id}`);
        return response.data;
    },

    /**
     * Get product by ID
     * @param {string} id - Product ID
     */
    getProductById: async (id) => {
        const response = await api.get(`/products/seller/${id}`);
        return response.data;
    },
};
