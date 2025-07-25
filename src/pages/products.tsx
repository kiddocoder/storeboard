import React, { useContext, useState } from 'react';
import { AppContext } from '../contexts/app';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

export const ProductsPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { products, categories, darkMode } = context;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.barcode.includes(searchTerm);
        const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Products</h2>
                <button className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}>
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add Product
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 border rounded-lg ${darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={`rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Product</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Barcode</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Category</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Supplier</th>
                                <th className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredProducts.map((product) => {
                                const category = categories.find(c => c.id === product.categoryId);
                                return (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {product.name}
                                                </div>
                                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {product.description}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                            {product.barcode}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                            {category?.name || 'N/A'}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                            {product.supplier}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-900'}`}>
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className={`${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-900'}`}>
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className={`${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-900'}`}>
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};