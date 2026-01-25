import { useState, useEffect } from 'react';
import { Search, Filter, Package, ChevronRight, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { OrderDetailsModal } from '../components/orders/OrderDetailsModal';

const STATUS_TABS = [
    { id: 'ALL', label: 'All Orders' },
    { id: 'PENDING', label: 'Pending' },
    { id: 'PROCESSING', label: 'Processing' },
    { id: 'SHIPPED', label: 'Shipped' },
    { id: 'DELIVERED', label: 'Delivered' },
    { id: 'CANCELLED', label: 'Cancelled' },
];

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const toast = useToast();

    useEffect(() => {
        loadOrders();
    }, [statusFilter, pagination.page]);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrders(pagination.page, 20, statusFilter);
            setOrders(res.data?.orders || []);
            setPagination(res.pagination || { page: 1, total: 0, pages: 0 });
        } catch (error) {
            toast.error('Failed to load orders');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            toast.success(`Order marked as ${newStatus.toLowerCase()}`);
            setIsDetailsOpen(false); // Optionally close modal, or refresh details
            loadOrders(); // Refresh list
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const viewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'SHIPPED': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'DELIVERED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your customer orders</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2 scrollbar-hide border-b border-gray-200 dark:border-dark-border">
                {STATUS_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setStatusFilter(tab.id);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors relative ${statusFilter === tab.id
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                            }`}
                    >
                        {tab.label}
                        {statusFilter === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <LoadingSkeleton key={i} height="h-24" />
                    ))}
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <Card key={order._id} className="p-0 overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Order Info */}
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-100 dark:border-dark-border">
                                        <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 dark:text-white">#{order.orderNumber}</span>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span>{order.items.length} items</span>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="font-medium text-gray-900 dark:text-gray-300">₹{order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Info & Action */}
                                <div className="flex items-center justify-between md:justify-end gap-6 flex-1 min-w-0">
                                    <div className="hidden md:block text-right">
                                        <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{order.customer.name}</p>
                                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{order.shippingAddress.city}</p>
                                    </div>
                                    <Button
                                        onClick={() => viewDetails(order)}
                                        variant="ghost"
                                        className="gap-2 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 group-hover:text-primary-600 dark:group-hover:text-primary-400"
                                    >
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.page === page
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-card'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No orders found"
                    message="When you receive orders, they will appear here."
                />
            )}

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                order={selectedOrder}
                onUpdateStatus={handleStatusUpdate}
            />
        </div>
    );
};
