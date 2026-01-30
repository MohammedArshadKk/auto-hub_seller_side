import api from './api';

/**
 * Order Service - Handles all order-related API calls for sellers
 */
export const orderService = {
    /**
     * Get seller's orders with filters
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @param {string} status - Filter by status
     */
    getOrders: async (page = 1, limit = 20, status = null) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(status && status !== 'ALL' && { status }),
        });

        const response = await api.get(`/orders/seller/my-orders?${params.toString()}`);
        return response.data;
    },

    /**
     * Get order by ID
     * @param {string} id - Order ID
     */
    getOrderById: async (id) => {
        const response = await api.get(`/orders/seller/${id}`);
        return response.data;
    },

    /**
     * Update order status
     * @param {string} id - Order ID
     * @param {string} status - New status
     * @param {string} note - Optional note
     */
    updateOrderStatus: async (id, status, note = "") => {
        const response = await api.patch(`/orders/${id}/status`, { status, note });
        return response.data;
    }
};
