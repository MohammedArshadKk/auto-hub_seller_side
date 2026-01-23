/**
 * Loading skeleton components for different layouts
 */
export const LoadingSkeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
    return (
        <div className={`${width} ${height} bg-gray-200 dark:bg-dark-border rounded animate-skeleton ${className}`} />
    );
};

/**
 * Card skeleton
 */
export const CardSkeleton = () => {
    return (
        <div className="card p-6 space-y-4">
            <LoadingSkeleton width="w-3/4" height="h-6" />
            <LoadingSkeleton width="w-full" height="h-4" />
            <LoadingSkeleton width="w-full" height="h-4" />
            <LoadingSkeleton width="w-2/3" height="h-4" />
        </div>
    );
};

/**
 * Table row skeleton
 */
export const TableRowSkeleton = ({ columns = 5 }) => {
    return (
        <tr>
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-4">
                    <LoadingSkeleton />
                </td>
            ))}
        </tr>
    );
};

/**
 * Grid skeleton
 */
export const GridSkeleton = ({ items = 6, columns = 3 }) => {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
            {Array.from({ length: items }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
};
