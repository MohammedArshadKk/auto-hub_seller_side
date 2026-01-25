import { useState, useEffect } from 'react';
import { Upload, X, Plus, Trash2, Check, Shield, ShieldOff, List, IndianRupee, Box, Ruler } from 'lucide-react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export const ProductDetailsStep = ({ selectedPart, initialData, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        ...initialData,
        isCustomBrand: initialData.brand && !selectedPart.brand?.includes(initialData.brand),
        isCustomPartNumber: initialData.partNumber && !selectedPart.partNumbers?.includes(initialData.partNumber),
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        if (field === 'brand' && value === 'ADD_NEW') {
            setFormData(prev => ({ ...prev, brand: '', isCustomBrand: true }));
            return;
        }
        if (field === 'partNumber' && value === 'ADD_NEW') {
            setFormData(prev => ({ ...prev, partNumber: '', isCustomPartNumber: true }));
            return;
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleKeyPointChange = (index, value) => {
        const newPoints = [...formData.keyPoints];
        newPoints[index] = value;
        setFormData(prev => ({ ...prev, keyPoints: newPoints }));
    };

    const addKeyPoint = () => {
        setFormData(prev => ({ ...prev, keyPoints: [...prev.keyPoints, ''] }));
    };

    const removeKeyPoint = (index) => {
        const newPoints = formData.keyPoints.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, keyPoints: newPoints.length ? newPoints : [''] }));
    };

    const getVehicleKey = (v) => `${v.year}-${v.make}-${v.model}`;

    const toggleVehicle = (vehicle) => {
        const vehicleKey = getVehicleKey(vehicle);
        const isSelected = formData.compatibleVehicles.some(v => getVehicleKey(v) === vehicleKey);

        const newVehicles = isSelected
            ? formData.compatibleVehicles.filter(v => getVehicleKey(v) !== vehicleKey)
            : [...formData.compatibleVehicles, vehicle];
        setFormData(prev => ({ ...prev, compatibleVehicles: newVehicles }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 10) {
            setErrors(prev => ({ ...prev, images: 'Maximum 10 images allowed' }));
            return;
        }

        const newImageObjects = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImageObjects],
        }));
        if (errors.images) setErrors(prev => ({ ...prev, images: '' }));
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.title?.trim()) newErrors.title = 'Product title is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
        if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock must be 0 or greater';
        if (formData.images.length === 0) newErrors.images = 'At least one image is required';
        if (!formData.brand) newErrors.brand = 'Brand is required';
        if (!formData.partNumber) newErrors.partNumber = 'Part number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header / Title */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <List className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Basic Information
                    </h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <Input
                        label="Product Title *"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        error={errors.title}
                        placeholder="Enter descriptive title for your product"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Brand *
                                </label>
                                {!formData.isCustomBrand ? (
                                    <select
                                        value={formData.brand}
                                        onChange={(e) => handleChange('brand', e.target.value)}
                                        className={`input-field ${errors.brand ? 'border-danger-500' : ''}`}
                                    >
                                        <option value="">Select Brand</option>
                                        {selectedPart.brand?.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                        <option value="ADD_NEW">+ Add New Brand...</option>
                                    </select>
                                ) : (
                                    <div className="relative">
                                        <Input
                                            value={formData.brand}
                                            onChange={(e) => handleChange('brand', e.target.value)}
                                            placeholder="Enter brand name"
                                            className={errors.brand ? 'border-danger-500' : ''}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isCustomBrand: false, brand: '' }))}
                                            className="absolute right-3 top-[38px] text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Select from list
                                        </button>
                                    </div>
                                )}
                                {errors.brand && <p className="text-xs text-danger-500 mt-1">{errors.brand}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Part Number *
                                </label>
                                {!formData.isCustomPartNumber ? (
                                    <select
                                        value={formData.partNumber}
                                        onChange={(e) => handleChange('partNumber', e.target.value)}
                                        className={`input-field ${errors.partNumber ? 'border-danger-500' : ''}`}
                                    >
                                        <option value="">Select Part Number</option>
                                        {selectedPart.partNumbers?.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                        <option value="ADD_NEW">+ Add New Part Number...</option>
                                        {!selectedPart.partNumbers?.length && (
                                            <option value="UNIVERSAL">Universal / Default</option>
                                        )}
                                    </select>
                                ) : (
                                    <div className="relative">
                                        <Input
                                            value={formData.partNumber}
                                            onChange={(e) => handleChange('partNumber', e.target.value)}
                                            placeholder="Enter part number"
                                            className={errors.partNumber ? 'border-danger-500' : ''}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isCustomPartNumber: false, partNumber: '' }))}
                                            className="absolute right-3 top-[38px] text-xs text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            Select from list
                                        </button>
                                    </div>
                                )}
                                {errors.partNumber && <p className="text-xs text-danger-500 mt-1">{errors.partNumber}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Price and Inventory */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Your Price *"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        error={errors.price}
                        placeholder="0.00"
                        icon={IndianRupee}
                    />

                    <Input
                        label="Compare at Price (Optional)"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => handleChange('originalPrice', e.target.value)}
                        error={errors.originalPrice}
                        placeholder="0.00"
                        icon={IndianRupee}
                    />

                    <Input
                        label="Stock Quantity *"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => handleChange('stock', e.target.value)}
                        error={errors.stock}
                        placeholder="1"
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Product Condition *
                        </label>
                        <select
                            value={formData.condition}
                            onChange={(e) => handleChange('condition', e.target.value)}
                            className="input-field"
                        >
                            <option value="NEW">New</option>
                            <option value="Refurbished">Refurbished</option>
                            <option value="Used - Like New">Used - Like New</option>
                            <option value="Used - Good">Used - Good</option>
                            <option value="Used - Fair">Used - Fair</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Shipping Information */}
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Box className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Shipping Information
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Weight
                        </label>
                        <div className="flex rounded-md shadow-sm">
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.weight?.value || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    weight: { value: '', unit: 'kg', ...(prev.weight || {}), value: e.target.value }
                                }))}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                placeholder="0.00"
                            />
                            <select
                                value={formData.weight?.unit || 'kg'}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    weight: { value: '', unit: 'kg', ...(prev.weight || {}), unit: e.target.value }
                                }))}
                                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-border text-gray-500 dark:text-gray-400 sm:text-sm rounded-r-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="kg">kg</option>
                                <option value="lb">lb</option>
                            </select>
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Dimensions (L × W × H)
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="L"
                                    value={formData.dimensions?.length || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        dimensions: { length: '', width: '', height: '', unit: 'cm', ...(prev.dimensions || {}), length: e.target.value }
                                    }))}
                                    className="block w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="W"
                                    value={formData.dimensions?.width || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        dimensions: { length: '', width: '', height: '', unit: 'cm', ...(prev.dimensions || {}), width: e.target.value }
                                    }))}
                                    className="block w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="H"
                                    value={formData.dimensions?.height || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        dimensions: { length: '', width: '', height: '', unit: 'cm', ...(prev.dimensions || {}), height: e.target.value }
                                    }))}
                                    className="block w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                            </div>
                            <select
                                value={formData.dimensions?.unit || 'cm'}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    dimensions: { length: '', width: '', height: '', unit: 'cm', ...(prev.dimensions || {}), unit: e.target.value }
                                }))}
                                className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-border bg-gray-50 dark:bg-dark-border text-gray-900 dark:text-white sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Key Points */}
            <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Product Key Features
                    </h3>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Plus}
                        onClick={addKeyPoint}
                    >
                        Add Point
                    </Button>
                </div>
                <div className="space-y-3">
                    {formData.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                            <Input
                                value={point}
                                onChange={(e) => handleKeyPointChange(idx, e.target.value)}
                                placeholder={`Feature point ${idx + 1}`}
                                className="flex-1"
                            />
                            {formData.keyPoints.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeKeyPoint(idx)}
                                    className="p-2 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors mt-auto h-11"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Warranty and Remarks */}
            <Card className="p-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.warrantyEnabled ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-400'}`}>
                                {formData.warrantyEnabled ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Warranty</p>
                                <p className="text-sm text-gray-500">Provide warranty information if available</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={formData.warrantyEnabled}
                                onChange={(e) => handleChange('warrantyEnabled', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-dark-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                        </label>
                    </div>

                    {formData.warrantyEnabled && (
                        <Input
                            label="Warranty Policy Details"
                            value={formData.warranty}
                            onChange={(e) => handleChange('warranty', e.target.value)}
                            placeholder="e.g., 6 Months replacement warranty"
                            className="animate-slide-up"
                        />
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={formData.remarks}
                            onChange={(e) => handleChange('remarks', e.target.value)}
                            rows={3}
                            className="input-field"
                            placeholder="Any internal notes or special remarks for customers..."
                        />
                    </div>
                </div>
            </Card>

            {/* Compatible Vehicles */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Compatible Vehicles (Select applicable)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedPart.compatibleVehicles?.map((vehicle) => {
                        const isSelected = formData.compatibleVehicles.some(v => getVehicleKey(v) === getVehicleKey(vehicle));
                        return (
                            <button
                                key={getVehicleKey(vehicle)}
                                type="button"
                                onClick={() => toggleVehicle(vehicle)}
                                className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${isSelected
                                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-400'
                                    : 'bg-white dark:bg-dark-bg border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:border-primary-300'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border ${isSelected ? 'bg-primary-600 border-primary-600' : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className="text-sm truncate">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </span>
                            </button>
                        );
                    })}
                    {!selectedPart.compatibleVehicles?.length && (
                        <p className="text-sm text-gray-500 col-span-full italic">No vehicle data available for this part.</p>
                    )}
                </div>
            </Card>

            {/* Images */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Product Images *
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Upload up to 10 photos. First photo will be primary.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={img.preview || img} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="p-2 bg-danger-500 text-white rounded-full hover:bg-danger-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            {idx === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded uppercase">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                    {formData.images.length < 10 && (
                        <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 dark:border-dark-border rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs font-medium text-gray-500">Add Photo</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                        </label>
                    )}
                </div>
                {errors.images && <p className="text-xs text-danger-500">{errors.images}</p>}
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-dark-border">
                <Button type="button" variant="ghost" onClick={onBack}>
                    Back to Search
                </Button>
                <div className="flex gap-3">
                    <Button type="submit" variant="primary" size="lg">
                        Review Product
                    </Button>
                </div>
            </div>
        </form>
    );
};
