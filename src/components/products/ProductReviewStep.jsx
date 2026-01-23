import { Edit2, Package, Check, Shield, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const ProductReviewStep = ({ selectedPart, productData, onSubmit, onEdit, submitting }) => {
    const discount = productData.originalPrice && productData.price
        ? Math.round(((parseFloat(productData.originalPrice) - parseFloat(productData.price)) / parseFloat(productData.originalPrice)) * 100)
        : 0;

    const getVehicleKey = (v) => v._id || `${v.year}-${v.make}-${v.model}`;

    return (
        <div className="space-y-6">
            {/* Header / Product Summary */}
            <Card className="p-6 border-b-4 border-b-primary-600">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">Preview Listing</span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                            {productData.title}
                        </h2>
                    </div>
                    <button
                        onClick={() => onEdit(2)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors border border-gray-200 dark:border-dark-border"
                        title="Edit Details"
                    >
                        <Edit2 className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Price</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">${productData.price}</p>
                            {productData.originalPrice && (
                                <p className="text-sm text-gray-400 line-through">${productData.originalPrice}</p>
                            )}
                        </div>
                        {discount > 0 && (
                            <span className="inline-block px-2 py-0.5 bg-danger-100 text-danger-600 text-xs font-bold rounded">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Stock & Condition</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{productData.stock} available</p>
                        <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-600 text-xs font-bold rounded uppercase">
                            {productData.condition.replace(/_/g, ' ')}
                        </span>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Brand & Part #</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{productData.brand}</p>
                        <p className="text-sm text-gray-500">PN: {productData.partNumber}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features & Key Points */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Check className="w-5 h-5 text-success-500" />
                        Key Features
                    </h3>
                    <ul className="space-y-3">
                        {productData.keyPoints.filter(p => p.trim() !== '').map((point, idx) => (
                            <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                                <Check className="w-4 h-4 text-success-500 mt-1 flex-shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* Warranty & Remarks */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary-500" />
                        Warranty & Notes
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Warranty Info</p>
                            {productData.warrantyEnabled ? (
                                <div className="p-3 bg-success-50 dark:bg-success-900/10 border border-success-200 dark:border-success-800 rounded-lg">
                                    <p className="text-success-700 dark:text-success-400 font-medium">{productData.warranty}</p>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No warranty provided</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Remarks</p>
                            <p className="text-gray-700 dark:text-gray-300">
                                {productData.remarks || <span className="italic text-gray-400">No remarks added</span>}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Compatible Vehicles */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-orange-500" />
                        Compatible Vehicles ({productData.compatibleVehicles.length})
                    </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                    {productData.compatibleVehicles.map((vehicle) => (
                        <div
                            key={getVehicleKey(vehicle)}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-dark-border"
                        >
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </div>
                    ))}
                    {productData.compatibleVehicles.length === 0 && (
                        <p className="text-sm text-gray-500 italic">No compatible vehicles selected</p>
                    )}
                </div>
            </Card>

            {/* Product Images */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Photos
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {productData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-border">
                            <img
                                src={img.preview || img}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            {idx === 0 && (
                                <div className="absolute top-0 left-0 right-0 py-1 bg-primary-600/90 text-white text-[8px] font-bold text-center uppercase tracking-tighter">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Final Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700 dark:text-blue-400">
                    By submitting this listing, you confirm that all information provided is accurate and that you have physical possession of the stock described above.
                </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center py-6 border-t border-gray-200 dark:border-dark-border">
                <Button type="button" variant="ghost" onClick={() => onEdit(2)}>
                    Back to Edit
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={onSubmit}
                    loading={submitting}
                >
                    Confirm & Publish Listing
                </Button>
            </div>
        </div>
    );
};
