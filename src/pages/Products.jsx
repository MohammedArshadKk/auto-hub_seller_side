import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Edit2, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductDetailsModal } from '../components/products/ProductDetailsModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const STATUS_BADGES = {
    PENDING_APPROVAL: { label: 'Pending', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400' },
    ACTIVE: { label: 'Active', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' },
    REJECTED: { label: 'Rejected', color: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-warning-400' },
};

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        loadProducts();
    }, [statusFilter, pagination.page]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await productService.getMyProducts(pagination.page, 20, statusFilter || null);
            setProducts(res.data?.products || []);
            setPagination(res.pagination || { page: 1, total: 0, pages: 0 });
        } catch (error) {
            toast.error('Failed to load products');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            await productService.deleteProduct(deletingId);
            toast.success('Product deleted successfully');
            setIsDeleteOpen(false);
            loadProducts();
        } catch (error) {
            toast.error(error.message || 'Failed to delete product');
        } finally {
            setIsDeleting(false);
            setDeletingId(null);
        }
    };

    const filteredProducts = products.filter(product =>
        (product.name || product.part?.partName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.partNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Products
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your product listings
                    </p>
                </div>
                <Button
                    icon={Plus}
                    onClick={() => navigate('/create-product')}
                    variant="primary"
                >
                    Create Product
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="input-field pl-11"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="input-field"
                    >
                        <option value="">All Status</option>
                        <option value="PENDING_APPROVAL">Pending Approval</option>
                        <option value="ACTIVE">Approved / Active</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </Card>

            {/* Products List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <LoadingSkeleton key={i} height="h-32" />
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 gap-4">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onDelete={(id) => {
                                    setDeletingId(id);
                                    setIsDeleteOpen(true);
                                }}
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsDetailsOpen(true);
                                }}
                            />
                        ))}
                    </div>

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

                    {/* Details Modal */}
                    <ProductDetailsModal
                        product={selectedProduct}
                        isOpen={isDetailsOpen}
                        onClose={() => {
                            setIsDetailsOpen(false);
                            setSelectedProduct(null);
                        }}
                    />

                    {/* Delete Confirmation */}
                    <ConfirmDialog
                        isOpen={isDeleteOpen}
                        onClose={() => {
                            setIsDeleteOpen(false);
                            setDeletingId(null);
                        }}
                        onConfirm={handleDelete}
                        title="Delete Product"
                        message="Are you sure you want to delete this product? This action will archive the listing and cannot be easily undone."
                        confirmLabel="Delete Listing"
                        loading={isDeleting}
                        variant="danger"
                    />
                </>
            ) : (
                <EmptyState
                    icon={Package}
                    title="No products found"
                    message={searchQuery ? "Try adjusting your search." : "Start by creating your first product."}
                    action={() => navigate('/create-product')}
                    actionLabel="Create Product"
                />
            )}
        </div>
    );
};

const ProductCard = ({ product, onDelete, onClick }) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const status = STATUS_BADGES[product.status] || STATUS_BADGES.PENDING_APPROVAL;

    const discount = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Card className="p-6 cursor-pointer hover:border-primary-400 dark:hover:border-primary-600 transition-all group" onClick={onClick}>
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="w-24 h-24 rounded-lg bg-gray-100 dark:bg-dark-border flex-shrink-0 overflow-hidden">
                    {product.images && product.images[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name || product.part?.partName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
                                {product.name || product.part?.partName || 'Unknown Part'}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                                    {status.label}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {product.part?.partName || product.partId?.category}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${product.price}
                                </span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                            ${product.originalPrice}
                                        </span>
                                        <span className="text-sm font-medium text-danger-600 dark:text-danger-400">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                                    Stock: {product.stock}
                                </span>
                            </div>
                        </div>

                        {/* Actions Menu */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-10 py-1">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit-product/${product._id}`);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border flex items-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(product._id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
