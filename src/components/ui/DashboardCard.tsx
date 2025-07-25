import React, { useContext } from 'react';
import { AppContext } from '../../contexts/app';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const DashboardCard: React.FC<{ title: string; value: string; change: string; trend: 'up' | 'down'; icon: React.ComponentType<any> }> = ({
    title, value, change, trend, icon: Icon
}) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { darkMode } = context;

    return (
        <div className={`p-6 rounded-lg shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-colors`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
                    <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
                </div>
                <Icon className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            </div>
            <div className="mt-4 flex items-center">
                {trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {change}
                </span>
                <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>vs last month</span>
            </div>
        </div>
    );
};