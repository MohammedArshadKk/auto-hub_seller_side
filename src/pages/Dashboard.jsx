import { TrendingUp, TrendingDown, Package, CheckCircle, Clock, Truck, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Products', value: '0', change: '+0%', icon: Package, trend: 'up', color: 'primary' },
        { label: 'Approved Products', value: '0', change: '+0%', icon: CheckCircle, trend: 'up', color: 'success' },
        { label: 'Pending Approvals', value: '0', change: '0%', icon: Clock, trend: 'down', color: 'warning' },
        { label: 'Orders to Fulfill', value: '0', badge: '0 Urgent', icon: Truck, color: 'danger' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                                {stat.change && (
                                    <p className={`text-sm mt-2 flex items-center ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                                        {stat.change}
                                    </p>
                                )}
                                {stat.badge && (
                                    <span className="inline-block bg-danger-500 text-white text-xs font-bold px-2 py-1 rounded mt-2">
                                        {stat.badge}
                                    </span>
                                )}
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' :
                                    stat.color === 'success' ? 'bg-success-100 dark:bg-success-900/30 text-success-600' :
                                        stat.color === 'warning' ? 'bg-warning-100 dark:bg-warning-900/30 text-warning-600' :
                                            'bg-danger-100 dark:bg-danger-900/30 text-danger-600'
                                }`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sales Chart and Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Performance */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Performance</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Revenue analytics for the last 30 days</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">$0</p>
                            <p className="text-sm text-success-600">+0%</p>
                        </div>
                    </div>
                    {/* Chart placeholder */}
                    <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400">Chart will display here</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                    <div className="bg-primary-600 text-white rounded-xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold mb-2">Grow Your Business</h3>
                        <p className="text-sm text-primary-100 mb-4">Upload new inventory to reach more customers today.</p>
                        <button
                            onClick={() => navigate('/create-product')}
                            className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors w-full flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Product
                        </button>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Shortcuts</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/products')}
                                className="w-full flex items-center justify-between px-4 py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                            >
                                <span className="font-medium">View My Products</span>
                                <span>→</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-bg transition-colors">
                                <span className="font-medium">View Orders</span>
                                <span>→</span>
                            </button>
                            <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-bg transition-colors">
                                <span className="font-medium">Check Earnings</span>
                                <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-gray-200 dark:border-dark-border shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <div className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Start by creating your first product
                    </p>
                    <button
                        onClick={() => navigate('/create-product')}
                        className="mt-4 btn btn-primary"
                    >
                        Create Product
                    </button>
                </div>
            </div>
        </div>
    );
};
