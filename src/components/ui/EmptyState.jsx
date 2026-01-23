/**
 * Empty state component with icon, message, and CTA
 */
export const EmptyState = ({
    icon: Icon,
    title,
    message,
    action,
    actionLabel
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            {Icon && (
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                {message}
            </p>
            {action && actionLabel && (
                <button
                    onClick={action}
                    className="btn btn-primary"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};
