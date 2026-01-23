/**
 * Card component with hover effects
 */
export const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <div
            className={`card ${hover ? 'hover:shadow-md' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

/**
 * Card Header
 */
export const CardHeader = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-b border-gray-200 dark:border-dark-border ${className}`}>
            {children}
        </div>
    );
};

/**
 * Card Body
 */
export const CardBody = ({ children, className = '' }) => {
    return (
        <div className={`p-6 ${className}`}>
            {children}
        </div>
    );
};

/**
 * Card Footer
 */
export const CardFooter = ({ children, className = '' }) => {
    return (
        <div className={`p-6 border-t border-gray-200 dark:border-dark-border ${className}`}>
            {children}
        </div>
    );
};
