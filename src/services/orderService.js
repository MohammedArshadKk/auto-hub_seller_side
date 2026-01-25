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

        // Simulating API response for development if backend isn't ready
        // Replace with actual API call:
        // const response = await api.get(`/orders/seller?${params.toString()}`);
        // return response.data;

        // MOCK DATA START
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        return {
            status: "success",
            data: {
                orders: [
                    {
                        _id: "ord_123456",
                        orderNumber: "ORD-2024-001",
                        customer: {
                            name: "Rahul Sharma",
                            email: "rahul@example.com",
                            phone: "+91 98765 43210"
                        },
                        items: [
                            {
                                product: {
                                    name: "K&N High Flow Air Filter",
                                    image: "https://via.placeholder.com/150",
                                },
                                quantity: 1,
                                price: 1200
                            }
                        ],
                        totalAmount: 1200,
                        status: "PENDING",
                        paymentStatus: "PAID",
                        shippingAddress: {
                            street: "123 Main St, Oberoi Garden",
                            city: "Mumbai",
                            state: "Maharashtra",
                            zipCode: "400001",
                            country: "India"
                        },
                        createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                    },
                    {
                        _id: "ord_123457",
                        orderNumber: "ORD-2024-002",
                        customer: {
                            name: "Priya Patel",
                            email: "priya@example.com",
                            phone: "+91 98765 12345"
                        },
                        items: [
                            {
                                product: {
                                    name: "Premium Brake Pad Set",
                                    image: "https://via.placeholder.com/150",
                                },
                                quantity: 2,
                                price: 2400
                            }
                        ],
                        totalAmount: 2400,
                        status: "SHIPPED",
                        paymentStatus: "PAID",
                        shippingAddress: {
                            street: "456 Park Avenue",
                            city: "Delhi",
                            state: "Delhi",
                            zipCode: "110001",
                            country: "India"
                        },
                        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                    }
                ]
            },
            pagination: {
                page: page,
                limit: limit,
                total: 2,
                pages: 1
            }
        };
        // MOCK DATA END
    },

    /**
     * Get order by ID
     * @param {string} id - Order ID
     */
    getOrderById: async (id) => {
        // const response = await api.get(`/orders/seller/${id}`);
        // return response.data;

        // Mock implementation for now
        return {
            status: "success",
            data: {
                order: {
                    _id: id,
                    orderNumber: "ORD-2024-MOCK",
                    // ... fill with detailed mock data as needed
                }
            }
        };
    },

    /**
     * Update order status
     * @param {string} id - Order ID
     * @param {string} status - New status
     */
    updateOrderStatus: async (id, status) => {
        // const response = await api.patch(`/orders/seller/${id}/status`, { status });
        // return response.data;

        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            status: "success",
            message: "Order status updated successfully"
        };
    }
};
