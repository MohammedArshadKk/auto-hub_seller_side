import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, Loader2, Package } from 'lucide-react';
import { partService } from '../../services/partService';
import { useDebounce } from '../../hooks/useDebounce';
import { Card } from '../ui/Card';
import { LoadingSkeleton, GridSkeleton } from '../ui/LoadingSkeleton';
import { EmptyState } from '../ui/EmptyState';

export const PartSearchStep = ({ onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        brand: '',
        make: '',
        model: '',
        year: '',
    });
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

    // Filter options
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);
    const searchRef = useRef(null);
    const abortControllerRef = useRef(null);

    // Load filter options on mount
    useEffect(() => {
        loadFilterOptions();
    }, []);

    // Load autocomplete suggestions
    useEffect(() => {
        if (searchQuery.length >= 2) {
            loadSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    // Perform search when debounced value changes
    useEffect(() => {
        if (debouncedSearch || Object.values(filters).some(v => v)) {
            searchParts(1);
        } else {
            setParts([]);
            setPagination({ page: 1, total: 0, pages: 0 });
        }
    }, [debouncedSearch, filters]);

    // Load models when make changes
    useEffect(() => {
        if (filters.make) {
            loadModels(filters.make);
        } else {
            setModels([]);
            setFilters(prev => ({ ...prev, model: '' }));
        }
    }, [filters.make]);

    const loadFilterOptions = async () => {
        setLoadingFilters(true);
        try {
            const [categoriesRes, brandsRes, makesRes] = await Promise.all([
                partService.getCategories().catch(() => ({ data: [] })),
                partService.getBrands().catch(() => ({ data: [] })),
                partService.getMakes().catch(() => ({ data: [] })),
            ]);

            // Ensure we always have arrays
            setCategories(Array.isArray(categoriesRes?.data) ? categoriesRes.data : []);
            setBrands(Array.isArray(brandsRes?.data) ? brandsRes.data : []);
            setMakes(Array.isArray(makesRes?.data) ? makesRes.data : []);
        } catch (error) {
            console.error('Failed to load filters:', error);
            // Ensure arrays are set even on error
            setCategories([]);
            setBrands([]);
            setMakes([]);
        } finally {
            setLoadingFilters(false);
        }
    };

    const loadModels = async (make) => {
        try {
            const res = await partService.getModels(make);
            setModels(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to load models:', error);
            setModels([]);
        }
    };

    const loadSuggestions = async () => {
        try {
            const res = await partService.getSuggestions(searchQuery);
            setSuggestions(res.data?.suggestions || []);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
        }
    };

    const searchParts = async (page = 1) => {
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);

        try {
            const res = await partService.searchParts(debouncedSearch, filters, page, 20);
            setParts(res.data?.parts || []);
            setPagination(res.pagination || { page: 1, total: 0, pages: 0 });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Search failed:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion.text);
        setShowSuggestions(false);
        if (suggestion.category) {
            setFilters(prev => ({ ...prev, category: suggestion.category }));
        }
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            brand: '',
            make: '',
            model: '',
            year: '',
        });
        setSearchQuery('');
    };

    const hasActiveFilters = Object.values(filters).some(v => v) || searchQuery;

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <Card className="p-6">
                <div className="relative" ref={searchRef}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for parts (e.g., brake pads, alternator)..."
                        className="input-field pl-11 pr-24"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 btn btn-secondary py-2 ${showFilters ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-border transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-dark-border last:border-0"
                                >
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {suggestion.text}
                                        </div>
                                        {suggestion.category && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                in {suggestion.category}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Advanced Filters */}
            {showFilters && (
                <Card className="p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Advanced Filters
                        </h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Brand
                            </label>
                            <select
                                value={filters.brand}
                                onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Year
                            </label>
                            <input
                                type="number"
                                value={filters.year}
                                onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
                                placeholder="e.g., 2020"
                                min="1900"
                                max={new Date().getFullYear() + 2}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Make
                            </label>
                            <select
                                value={filters.make}
                                onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                                className="input-field"
                            >
                                <option value="">All Makes</option>
                                {makes.map(make => (
                                    <option key={make} value={make}>{make}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Model
                            </label>
                            <select
                                value={filters.model}
                                onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                                disabled={!filters.make}
                                className="input-field"
                            >
                                <option value="">All Models</option>
                                {models.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>
            )}

            {/* Results */}
            {loading ? (
                <GridSkeleton items={6} columns={3} />
            ) : parts.length > 0 ? (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Found {pagination.total} results
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {parts.map(part => (
                            <PartCard key={part._id} part={part} onSelect={onSelect} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => searchParts(page)}
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
                </>
            ) : hasActiveFilters ? (
                <EmptyState
                    icon={Package}
                    title="No parts found"
                    message="Try adjusting your search or filters to find what you're looking for."
                    action={clearFilters}
                    actionLabel="Clear Filters"
                />
            ) : (
                <EmptyState
                    icon={Search}
                    title="Start searching"
                    message="Search for auto parts to create a new product listing."
                />
            )}
        </div>
    );
};

const PartCard = ({ part, onSelect }) => {
    const displayBrands = part.brand?.slice(0, 3) || [];
    const remainingBrands = (part.brand?.length || 0) - 3;

    return (
        <Card className="p-6 cursor-pointer" onClick={() => onSelect(part)}>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                {part.partName}
            </h3>
            <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                    {part.category}
                </span>
            </div>
            {displayBrands.length > 0 && (
                <div className="flex items-center gap-1 mb-3 flex-wrap">
                    {displayBrands.map((brand, idx) => (
                        <span
                            key={idx}
                            className="text-xs bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                        >
                            {brand}
                        </span>
                    ))}
                    {remainingBrands > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{remainingBrands} more
                        </span>
                    )}
                </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                {part.description}
            </p>
            {part.compatibleVehicles?.length > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {part.compatibleVehicles.length} compatible vehicles
                </p>
            )}
            <button className="w-full btn btn-primary">
                Select This Part
            </button>
        </Card>
    );
};
