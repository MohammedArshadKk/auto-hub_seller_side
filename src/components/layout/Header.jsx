import { Search, Bell, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by SKU, Part Name, or Order ID..."
                            className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-bg dark:text-white"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-600 dark:text-gray-400"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-600 dark:text-gray-400">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User */}
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg text-gray-600 dark:text-gray-400">
                        <User className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
