import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Package, Calendar, MapPin, User,
    Truck, CheckCircle, XCircle, Clock, AlertCircle, Phone, Mail, CreditCard
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';

export const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [statusNote, setStatusNote] = useState('');

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const res = await orderService.getOrderById(id);
            setOrder(res.data.order);
        } catch (error) {
            toast.error('Failed to load order details');
            navigate('/orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        setUpdating(true);
        try {
            await orderService.updateOrderStatus(id, newStatus, statusNote);
            toast.success(`Order status updated to ${newStatus}`);
            setStatusNote(''); // Reset note
            loadOrder(); // Refresh
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            'payment_pending': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            'confirmed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            'processing': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
            'shipped': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
            'out_for_delivery': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
            'delivered': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            'returned': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
            'payment_failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-5 h-5" />;
            case 'cancelled':
            case 'payment_failed': return <XCircle className="w-5 h-5" />;
            case 'shipped':
            case 'out_for_delivery': return <Truck className="w-5 h-5" />;
            case 'processing': return <Package className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) return <div className="p-6 space-y-4"><LoadingSkeleton height="h-32" /><LoadingSkeleton height="h-64" /></div>;
    if (!order) return <div className="p-6 text-center text-gray-500">Order not found</div>;

    // Allowed Actions Logic
    const nextActions = [];
    if (order.orderStatus === 'pending') {
        nextActions.push({ label: 'Confirm Order', value: 'confirmed', variant: 'primary' });
        nextActions.push({ label: 'Cancel Order', value: 'cancelled', variant: 'danger' });
    } else if (order.orderStatus === 'confirmed') {
        nextActions.push({ label: 'Process Order', value: 'processing', variant: 'primary' });
        nextActions.push({ label: 'Cancel Order', value: 'cancelled', variant: 'danger' });
    } else if (order.orderStatus === 'processing') {
        nextActions.push({ label: 'Ship Order', value: 'shipped', variant: 'primary' });
    } else if (order.orderStatus === 'shipped') {
        nextActions.push({ label: 'Out for Delivery', value: 'out_for_delivery', variant: 'primary' });
    } else if (order.orderStatus === 'out_for_delivery') {
        nextActions.push({ label: 'Mark Delivered', value: 'delivered', variant: 'success' });
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="p-2" onClick={() => navigate('/orders')}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            Order #{order.orderNumber}
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 ${getStatusColor(order.orderStatus)}`}>
                                {getStatusIcon(order.orderStatus)}
                                {order.orderStatus.replace(/_/g, ' ').toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                            Ordered on {new Date(order.orderedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Quick Actions Header - Only if actions available */}
                {nextActions.length > 0 && (
                    <div className="flex gap-2">
                        {nextActions.map(action => (
                            <Button
                                key={action.value}
                                variant={action.variant}
                                isLoading={updating}
                                onClick={() => handleStatusUpdate(action.value)}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg/50">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary-500" />
                                Order Items ({order.items.length})
                            </h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-dark-border">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-dark-elem/50 transition-colors">
                                    <img
                                        src={item.images?.[0] || 'https://via.placeholder.com/80'}
                                        alt={item.name}
                                        className="w-20 h-20 rounded-lg object-cover bg-gray-200 dark:bg-dark-bg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">₹{item.price}</p>
                                        <p className="text-sm text-gray-500">Total: ₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-dark-bg/50 border-t border-gray-100 dark:border-dark-border flex justify-end">
                            <div className="text-right space-y-1 w-full max-w-xs">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingCharge}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-dark-border">
                                    <span>Total</span>
                                    <span className="text-primary-600">₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary-500" />
                                Order Timeline
                            </h3>
                        </div>
                        <div className="p-6 relative">
                            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200 dark:bg-dark-border"></div>
                            <div className="space-y-8 relative z-0">
                                {order.statusHistory?.slice().reverse().map((event, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="w-4 h-4 rounded-full bg-primary-600 border-4 border-white dark:border-dark-card mt-1 shrink-0 shadow-sm" />
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                                                {event.status.replace(/_/g, ' ')}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </p>
                                            {event.note && (
                                                <p className="text-sm text-gray-500 mt-1 italic">
                                                    "{event.note}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {/* Initial State */}
                                <div className="flex gap-4">
                                    <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-white dark:border-dark-card mt-1 shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-500 dark:text-gray-400">Order Placed</p>
                                        <p className="text-sm text-gray-400 dark:text-gray-500">
                                            {new Date(order.orderedAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Customer & Admin */}
                <div className="space-y-6">
                    {/* Status Actions Card */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Status Management</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Current Status
                                </label>
                                <div className="p-2 bg-gray-100 dark:bg-dark-bg rounded border border-gray-200 dark:border-dark-border text-center font-medium capitalize">
                                    {order.orderStatus.replace(/_/g, ' ')}
                                </div>
                            </div>

                            {nextActions.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Add Note (Optional)
                                    </label>
                                    <textarea
                                        rows="2"
                                        className="w-full px-3 py-2 bg-white dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                        placeholder="e.g. Shipped via BlueDart #12345"
                                        value={statusNote}
                                        onChange={(e) => setStatusNote(e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-2">
                                {nextActions.map(action => (
                                    <Button
                                        key={action.value}
                                        variant={action.variant}
                                        isLoading={updating}
                                        onClick={() => handleStatusUpdate(action.value)}
                                        className="w-full justify-center"
                                    >
                                        {action.label}
                                    </Button>
                                ))}
                                {nextActions.length === 0 && (
                                    <p className="text-sm text-gray-500 text-center">No actions available for this status.</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Customer Details */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <User className="w-5 h-5 text-primary-500" />
                                Customer
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center text-gray-500 font-bold">
                                    {order.buyer?.name?.[0] || 'U'}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-gray-900 dark:text-white truncate">{order.buyer?.name || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500 truncate">Customer</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Mail className="w-4 h-4" />
                                    <span className="truncate">{order.buyer?.email || order.buyerEmail || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{order.buyer?.phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Shipping Info */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary-500" />
                                Shipping Address
                            </h3>
                        </div>
                        <div className="p-4 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-2">{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
                            <p className="flex items-center gap-2 mt-2">
                                <Phone className="w-3 h-3" /> {order.shippingAddress.phone}
                            </p>
                        </div>
                    </Card>

                    {/* Payment Info */}
                    <Card>
                        <div className="p-4 border-b border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary-500" />
                                Payment Info
                            </h3>
                        </div>
                        <div className="p-4 text-sm space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium uppercase">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.razorpayPaymentId && (
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Payment ID</span>
                                    <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{order.razorpayPaymentId}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
