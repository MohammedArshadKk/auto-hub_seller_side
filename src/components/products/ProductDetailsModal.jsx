import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { Package, Check, Shield, CircleDollarSign, Info, Calendar, Tag, Ruler, Weight } from 'lucide-react';

const STATUS_BADGES = {
    PENDING_APPROVAL: { label: 'Pending Approval', color: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400' },
    ACTIVE: { label: 'Active', color: 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' },
    REJECTED: { label: 'Rejected', color: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400' },
};

export const ProductDetailsModal = ({ product, isOpen, onClose }) => {
    if (!product) return null;

    const status = STATUS_BADGES[product.status] || STATUS_BADGES.PENDING_APPROVAL;
    const discount = product.originalPrice && product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Currency symbol mapping or fallback
    const currencySymbol = product.currency === 'INR' ? '₹' : product.currency === 'USD' ? '$' : product.currency || '$';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Product Details" size="lg">
            <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* Header Summary */}
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/5 aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-border shadow-inner">
                        {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-4">
                        <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${status.color}`}>
                                {status.label}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                {product.name || product.part?.partName}
                            </h2>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                                <Tag className="w-4 h-4" />
                                <span className="text-sm">{product.category || product.partId?.category || 'General'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Price</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{currencySymbol}{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-sm text-gray-400 line-through">{currencySymbol}{product.originalPrice}</span>
                                    )}
                                </div>
                                {discount > 0 && <span className="text-[10px] font-bold text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20 px-1.5 py-0.5 rounded">{discount}% OFF</span>}
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-tight mb-1">Stock</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.stock} Units</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <Info className="w-4 h-4" />
                                <span>Condition: <span className="font-semibold text-gray-900 dark:text-white">{product.condition}</span></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Listed: <span className="font-semibold text-gray-900 dark:text-white">{new Date(product.createdAt).toLocaleDateString()}</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description and Remarks */}
                <div className="space-y-4">
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Product Description</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description || 'No detailed description provided.'}
                        </p>
                    </Card>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand & PN */}
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Identification</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-100 dark:border-dark-border">
                                <span className="text-gray-500">Brand</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{product.brand}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-gray-500">Part Number</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{product.partNumber}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Features */}
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Key Features</h3>
                        <ul className="space-y-2">
                            {(product.features || product.keyPoints)?.map((point, idx) => (
                                <li key={idx} className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Check className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                </li>
                            ))}
                            {!(product.features?.length || product.keyPoints?.length) && <p className="text-sm text-gray-500 italic">No features listed</p>}
                        </ul>
                    </Card>
                </div>

                {/* Measurements If Available */}
                {(product.weight?.value || product.dimensions?.length) && (
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Measurements</h3>
                        <div className="grid grid-cols-2 gap-6">
                            {product.weight?.value && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                        <Weight className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Weight</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{product.weight.value} {product.weight.unit}</p>
                                    </div>
                                </div>
                            )}
                            {product.dimensions?.length && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                        <Ruler className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Dimensions</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {product.dimensions.length}x{product.dimensions.width}x{product.dimensions.height} {product.dimensions.unit}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Compatibility */}
                <Card className="p-5">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary-500" />
                        Compatibility ({product.compatibleVehicles?.length || 0})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.compatibleVehicles?.map((v, i) => (
                            <div key={i} className="flex flex-col p-2 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-lg">
                                <span className="font-bold text-gray-900 dark:text-white text-sm">
                                    {v.year} {v.make} {v.model}
                                </span>
                                {v.variant && <span className="text-xs text-gray-500">{v.variant}</span>}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Remarks */}
                {product.remarks && (
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-500" />
                            Seller Remarks
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            {product.remarks}
                        </p>
                    </Card>
                )}

                {/* Photo Gallery */}
                {product.images?.length > 1 && (
                    <Card className="p-5">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Additional Photos</h3>
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {product.images.slice(1).map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </Modal>
    );
};
