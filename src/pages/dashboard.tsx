import React, { useContext } from 'react';
import { AppContext } from '../contexts/app';
import { DashboardCard } from '../components/ui/DashboardCard';
import { Download, Package, AlertTriangle, DollarSign, Users } from 'lucide-react';

export const DashboardPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return <p>not contenxt </p>;

    const { darkMode, storeProducts, transactions, selectedStore } = context;

    const totalProducts = storeProducts.filter(sp => sp.storeId === selectedStore).length;
    const lowStockItems = storeProducts.filter(sp => sp.storeId === selectedStore && sp.stock <= sp.minStock).length;
    const totalSales = transactions
        .filter(t => t.type === 'sale' && t.storeId === selectedStore)
        .reduce((sum, t) => sum + t.total, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard</h2>
                <div className="flex space-x-2">
                    <button className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}>
                        <Download className="w-4 h-4 inline mr-2" />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard
                    title="Total Products"
                    value={totalProducts.toString()}
                    change="+12%"
                    trend="up"
                    icon={Package}
                />
                <DashboardCard
                    title="Low Stock Items"
                    value={lowStockItems.toString()}
                    change="-5%"
                    trend="down"
                    icon={AlertTriangle}
                />
                <DashboardCard
                    title="Total Sales"
                    value={`$${totalSales.toLocaleString()}`}
                    change="+23%"
                    trend="up"
                    icon={DollarSign}
                />
                <DashboardCard
                    title="Active Users"
                    value="8"
                    change="+2%"
                    trend="up"
                    icon={Users}
                />
            </div>

            {lowStockItems > 0 && (
                <div className={`p-4 rounded-lg border-l-4 border-yellow-400 ${darkMode ? 'bg-yellow-900/20 border-yellow-400' : 'bg-yellow-50 border-yellow-400'}`}>
                    <div className="flex">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        <div className="ml-3">
                            <p className={`text-sm font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                                Low Stock Alert
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                {lowStockItems} items are running low on stock. Consider restocking soon.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h3>
                    <div className="space-y-3">
                        {transactions.slice(0, 5).map((transaction) => (
                            <div key={transaction.id} className="flex justify-between items-center">
                                <div>
                                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {transaction.createdAt.toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`font-semibold ${transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'}`}>
                                    ${transaction.total.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stock Status</h3>
                    <div className="space-y-3">
                        {storeProducts.filter(sp => sp.storeId === selectedStore).slice(0, 5).map((item) => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div>
                                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Product #{item.productId}</p>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Min: {item.minStock}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className={`font-semibold ${item.stock <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                                        {item.stock}
                                    </span>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>in stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
