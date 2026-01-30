import { X, Package, MapPin, Calendar, CreditCard, ChevronRight, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const OrderDetailsModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
    if (!isOpen || !order) return null;

    const STATUS_COLORS = {
        PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' },
        PROCESSING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
        SHIPPED: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400' },
        DELIVERED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
        CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
    };

    const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.PENDING;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-dark-elem w-full max-w-4xl h-[90vh] rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col animate-slide-up">
                {
                    /* Header */
                }
                <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-white dark:bg-dark-elem sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Order #{order.orderNumber}
                            </h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary-500" />
                                Customer Details
                            </h3>
                            <div className="space-y-2">
                                <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer.email}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{order.customer.phone}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary-500" />
                                Shipping Address
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary-500" />
                            Order Items
                        </h3>
                        <div className="border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-center">Qty</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Price</th>
                                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-dark-border bg-white dark:bg-dark-card">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-dark-bg"
                                                    />
                                                    <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400">
                                                ₹{item.price}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                                ₹{item.price * item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-gray-50 dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
                                    <tr>
                                        <td colSpan="3" className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                                            Total Amount
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-xl text-primary-600">
                                            ₹{order.totalAmount}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-4 bg-gray-50 dark:bg-dark-elem border-t border-gray-100 dark:border-dark-border flex justify-end gap-3 sticky bottom-0 z-10">
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                    {order.status === 'PENDING' && (
                        <div className="flex gap-2">
                            <Button variant="danger" onClick={() => onUpdateStatus(order._id, 'CANCELLED')}>
                                Reject Order
                            </Button>
                            <Button variant="primary" onClick={() => onUpdateStatus(order._id, 'PROCESSING')}>
                                Accept & Process
                            </Button>
                        </div>
                    )}
                    {order.status === 'PROCESSING' && (
                        <Button variant="primary" onClick={() => onUpdateStatus(order._id, 'SHIPPED')}>
                            Mark as Shipped
                        </Button>
                    )}
                    {order.status === 'SHIPPED' && (
                        <Button variant="success" onClick={() => onUpdateStatus(order._id, 'DELIVERED')}>
                            Mark as Delivered
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
