import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, ShoppingCart, DollarSign, Settings, LogOut, List } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Plus, label: 'Create Product', path: '/create-product', highlight: true },
        { icon: List, label: 'My Products', path: '/products' },
        { icon: Package, label: 'Inventory', path: '/inventory' },
        { icon: ShoppingCart, label: 'Orders', path: '/orders', badge: 3 },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">AutoHub</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.businessName || 'Seller Portal'}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-between px-4 py-3 rounded-lg transition-all ${isActive
                                ? 'bg-primary-600 text-white shadow-sm'
                                : item.highlight
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg'
                            }`
                        }
                    >
                        <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && (
                            <span className="bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200 dark:border-dark-border">
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log Out</span>
                </button>
            </div>
        </div>
    );
};
