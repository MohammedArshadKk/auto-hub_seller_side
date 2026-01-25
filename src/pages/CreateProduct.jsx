import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { PartSearchStep } from '../components/products/PartSearchStep';
import { ProductDetailsStep } from '../components/products/ProductDetailsStep';
import { ProductReviewStep } from '../components/products/ProductReviewStep';
import { productService } from '../services/productService';
import { uploadService } from '../services/uploadService';
import { useToast } from '../context/ToastContext';

const STEPS = [
    { id: 1, name: 'Select Part' },
    { id: 2, name: 'Product Details' },
    { id: 3, name: 'Review & Submit' },
];

export const CreateProduct = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedPart, setSelectedPart] = useState(null);
    const [productData, setProductData] = useState({
        title: '',
        price: '',
        originalPrice: '',
        stock: '',
        condition: 'NEW',
        brand: '',
        partNumber: '',
        compatibleVehicles: [],
        warrantyEnabled: false,
        warranty: '',
        keyPoints: [''],
        remarks: '',
        images: [],
        weight: { value: '', unit: 'kg' },
        dimensions: { length: '', width: '', height: '', unit: 'cm' },
    });
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const toast = useToast();

    const handlePartSelect = (part) => {
        setSelectedPart(part);
        setProductData(prev => ({
            ...prev,
            title: part.partName,
            compatibleVehicles: [],
            brand: part.brand?.[0] || '',
            partNumber: part.partNumbers?.[0] || '',
        }));
        setCurrentStep(2);
    };

    const handleDetailsSubmit = (data) => {
        setProductData(data);
        setCurrentStep(3);
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleFinalSubmit = async () => {
        setSubmitting(true);
        try {
            // 1. Upload images to S3 first
            toast.info('Uploading product images...');
            const uploadedImageUrls = await uploadService.uploadMultipleToS3(productData.images);

            // 2. Prepare final payload with S3 URLs
            const payload = {
                partId: selectedPart._id,
                title: productData.title,
                price: parseFloat(productData.price),
                originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : undefined,
                stock: parseInt(productData.stock),
                condition: productData.condition,
                brand: productData.brand,
                isCustomBrand: productData.isCustomBrand,
                partNumber: productData.partNumber,
                isCustomPartNumber: productData.isCustomPartNumber,
                compatibleVehicles: productData.compatibleVehicles,
                warranty: productData.warrantyEnabled ? productData.warranty : undefined,
                keyPoints: productData.keyPoints.filter(p => p.trim() !== ''),
                remarks: productData.remarks || undefined,
                images: uploadedImageUrls,
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

            await productService.createProduct(payload);
            toast.success('Product created successfully!');
            navigate('/products');
        } catch (error) {
            toast.error(error.message || 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

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
                        Create New Product
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Add a new product to your inventory
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="card p-6">
                <div className="flex items-center justify-between">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex items-center flex-1">
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
                                        step.id
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
                                <div
                                    className={`flex-1 h-0.5 mx-4 transition-colors ${currentStep > step.id
                                        ? 'bg-success-500'
                                        : 'bg-gray-200 dark:bg-dark-border'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div>
                {currentStep === 1 && (
                    <PartSearchStep onSelect={handlePartSelect} />
                )}
                {currentStep === 2 && (
                    <ProductDetailsStep
                        selectedPart={selectedPart}
                        initialData={productData}
                        onSubmit={handleDetailsSubmit}
                        onBack={handleBack}
                    />
                )}
                {currentStep === 3 && (
                    <ProductReviewStep
                        selectedPart={selectedPart}
                        productData={productData}
                        onSubmit={handleFinalSubmit}
                        onEdit={(step) => setCurrentStep(step)}
                        submitting={submitting}
                    />
                )}
            </div>
        </div>
    );
};
