import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { ProductDetailsStep } from '../components/products/ProductDetailsStep';
import { ProductReviewStep } from '../components/products/ProductReviewStep';
import { productService } from '../services/productService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../context/ToastContext';

const STEPS = [
    { id: 2, name: 'Product Details' },
    { id: 3, name: 'Review & Changes' },
];

export const EditProduct = () => {
    const { id } = useParams();
    const [currentStep, setCurrentStep] = useState(2);
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState(null);
    const [selectedPart, setSelectedPart] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const res = await productService.getProductById(id);
            const p = res.data.product;

            setProductData({
                title: p.name,
                price: p.price.toString(),
                originalPrice: p.originalPrice ? p.originalPrice.toString() : '',
                stock: p.stock.toString(),
                condition: p.condition,
                brand: p.brand,
                partNumber: p.partNumber,
                compatibleVehicles: p.compatibleVehicles || [],
                warrantyEnabled: !!p.warranty,
                warranty: p.warranty || '',
                keyPoints: p.keyPoints?.length ? p.keyPoints : (p.features?.length ? p.features : ['']),
                remarks: p.remarks || '',
                images: p.images || [],
                isCustomBrand: p.isCustomBrand || false,
                isCustomPartNumber: p.isCustomPartNumber || false,
                weight: p.weight || { value: '', unit: 'kg' },
                dimensions: p.dimensions || { length: '', width: '', height: '', unit: 'cm' },
            });

            setSelectedPart(p.part);
        } catch (error) {
            toast.error('Failed to load product details');
            navigate('/products');
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsSubmit = (data) => {
        setProductData(data);
        setCurrentStep(3);
    };

    const handleBack = () => {
        if (currentStep > 2) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/products');
        }
    };

    const handleFinalSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Separate existing URLs from new File objects
            const existingUrls = productData.images.filter(img => typeof img === 'string');
            const newFiles = productData.images.filter(img => typeof img !== 'string');

            // 2. Upload only new images
            let uploadedUrls = [];
            if (newFiles.length > 0) {
                toast.info('Uploading new images...');
                uploadedUrls = await uploadService.uploadMultipleToS3(newFiles);
            }

            // 3. Combine all URLs
            const finalImages = [...existingUrls, ...uploadedUrls];

            // 4. Prepare payload (mapping title back to name if needed by backend, or keeping title as requested)
            const payload = {
                title: productData.title,
                price: parseFloat(productData.price),
                originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
                stock: parseInt(productData.stock),
                condition: productData.condition,
                brand: productData.brand,
                isCustomBrand: productData.isCustomBrand,
                partNumber: productData.partNumber,
                isCustomPartNumber: productData.isCustomPartNumber,
                compatibleVehicles: productData.compatibleVehicles,
                warranty: productData.warrantyEnabled ? productData.warranty : null,
                keyPoints: productData.keyPoints.filter(p => p.trim() !== ''),
                remarks: productData.remarks || null,
                images: finalImages,
                weight: productData.weight.value ? {
                    value: parseFloat(productData.weight.value),
                    unit: productData.weight.unit
                } : undefined,
                dimensions: (productData.dimensions.length && productData.dimensions.width && productData.dimensions.height) ? {
                    length: parseFloat(productData.dimensions.length),
                    width: parseFloat(productData.dimensions.width),
                    height: parseFloat(productData.dimensions.height),
                    unit: productData.dimensions.unit
                } : undefined,
            };

            await productService.updateProduct(id, payload);
            toast.success('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            toast.error(error.message || 'Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-500">Loading product information...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Edit Product
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Update your listing details
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="card p-6">
                <div className="flex items-center justify-center gap-12">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep > step.id
                                        ? 'bg-success-500 text-white'
                                        : currentStep === step.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-200 dark:bg-dark-border text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {currentStep > step.id ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                                <span
                                    className={`font-medium ${currentStep >= step.id
                                        ? 'text-gray-900 dark:text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {step.name}
                                </span>
                            </div>
                            {idx < STEPS.length - 1 && (
                                <div className="w-24 h-0.5 mx-4 bg-gray-200 dark:bg-dark-border" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div>
                {currentStep === 2 && (
                    <ProductDetailsStep
                        selectedPart={selectedPart}
                        initialData={productData}
                        onSubmit={handleDetailsSubmit}
                        onBack={handleBack}
                        isEdit={true}
                    />
                )}
                {currentStep === 3 && (
                    <ProductReviewStep
                        selectedPart={selectedPart}
                        productData={productData}
                        onSubmit={handleFinalSubmit}
                        onEdit={(step) => setCurrentStep(step)}
                        submitting={submitting}
                        isEdit={true}
                    />
                )}
            </div>
        </div>
    );
};
