import { forwardRef } from 'react';

/**
 * Modern Input component with floating labels and error states
 */
export const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`input-field ${Icon ? 'pl-11' : ''} ${error ? 'border-danger-500 focus:ring-danger-500' : ''
                        }`}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-danger-600 dark:text-danger-400">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
