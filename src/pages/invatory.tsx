import { useState, useContext } from 'react';
import {
    Search, Plus, Download, Edit, Eye, AlertTriangle,
    Package, TrendingUp, TrendingDown, MoreHorizontal, Scan
} from 'lucide-react';
import { AppContext } from '../contexts/app';

const InventoryPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const {
        storeProducts,
        products,
        categories,
        selectedStore,
        darkMode
    } = context;

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stockFilter, setStockFilter] = useState('all'); // all, low, out
    const [sortBy, setSortBy] = useState('name');

    // Filter and sort inventory data
    const storeInventory = storeProducts
        .filter(sp => sp.storeId === selectedStore)
        .map(sp => {
            const product = products.find(p => p.id === sp.productId);
            const category = categories.find(c => c.id === product?.categoryId);
            return {
                ...sp,
                product,
                category,
                stockStatus: sp.stock === 0 ? 'out' : sp.stock <= sp.minStock ? 'low' : 'normal'
            };
        })
        .filter(item => {
            if (!item.product) return false;

            const matchesSearch =
                item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.product.barcode.includes(searchTerm) ||
                item.product.brand.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !selectedCategory || item.product.categoryId === selectedCategory;

            const matchesStockFilter =
                stockFilter === 'all' ||
                (stockFilter === 'low' && item.stockStatus === 'low') ||
                (stockFilter === 'out' && item.stockStatus === 'out');

            return matchesSearch && matchesCategory && matchesStockFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return (a.product?.name || '').localeCompare(b.product?.name || '');
                case 'stock':
                    return b.stock - a.stock;
                case 'value':
                    return (b.stock * b.sellingPrice) - (a.stock * a.sellingPrice);
                default:
                    return 0;
            }
        });

    const totalValue = storeInventory.reduce((sum, item) => sum + (item.stock * item.sellingPrice), 0);
    const lowStockCount = storeInventory.filter(item => item.stockStatus === 'low').length;
    const outOfStockCount = storeInventory.filter(item => item.stockStatus === 'out').length;

    const getStockStatusColor = (status: string) => {
        switch (status) {
            case 'out':
                return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
            case 'low':
                return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
            default:
                return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Inventory Management
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                        Monitor and manage your stock levels across all products
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}>
                        <Scan className="w-4 h-4 mr-2" />
                        Scan
                    </button>
                    <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${darkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </button>
                    <button className={`flex items-center px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stock
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Items
                            </p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {storeInventory.length}
                            </p>
                        </div>
                        <Package className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Total Value
                            </p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                ${totalValue.toLocaleString()}
                            </p>
                        </div>
                        <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Low Stock
                            </p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {lowStockCount}
                            </p>
                        </div>
                        <AlertTriangle className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                    </div>
                </div>

                <div className={`p-6 rounded-xl shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Out of Stock
                            </p>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {outOfStockCount}
                            </p>
                        </div>
                        <TrendingDown className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                        } w-4 h-4`} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                </div>

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 border rounded-lg ${darkMode
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className={`px-4 py-2 border rounded-lg ${darkMode
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                    <option value="all">All Stock Levels</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                </select>

                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2 border rounded-lg ${darkMode
                        ? 'bg-gray-800 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                    <option value="name">Sort by Name</option>
                    <option value="stock">Sort by Stock</option>
                    <option value="value">Sort by Value</option>
                </select>
            </div>

            {/* Inventory Table */}
            <div className={`rounded-xl shadow-sm border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Product
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Stock
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Prices
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Value
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Location
                                </th>
                                <th className={`px-6 py-4 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'
                                    } uppercase tracking-wider`}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'
                            }`}>
                            {storeInventory.map((item) => (
                                <tr key={item.id} className={`hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'} transition-colors`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                                } flex items-center justify-center mr-3`}>
                                                <Package className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                            </div>
                                            <div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {item.product?.name}
                                                </div>
                                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {item.product?.brand} • {item.category?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {item.stock}
                                            </span>
                                            <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(item.stockStatus)
                                                }`}>
                                                {item.stockStatus === 'out' ? 'Out' :
                                                    item.stockStatus === 'low' ? 'Low' : 'Good'}
                                            </span>
                                        </div>
                                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Min: {item.minStock} | Max: {item.maxStock}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                            <div className="font-medium">${item.sellingPrice}</div>
                                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Cost: ${item.purchasePrice}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                            ${(item.stock * item.sellingPrice).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {item.location || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button className={`p-1 rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                                                <Eye className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                            </button>
                                            <button className={`p-1 rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                                                <Edit className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                            </button>
                                            <button className={`p-1 rounded hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors`}>
                                                <MoreHorizontal className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {storeInventory.length === 0 && (
                    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">No inventory items found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryPage;