import React, { useContext } from 'react';
import { AppContext } from '../../contexts/app';
import { Bell, Menu, Store, Wifi, WifiOff } from 'lucide-react';

const Header: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { user, isOnline, notifications, darkMode, setDarkMode } = context;

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 py-3 flex items-center justify-between transition-colors`}>
            <div className="flex items-center space-x-4">
                <button onClick={onMenuToggle} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} md:hidden`}>
                    <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-2">
                    <Store className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Storeboard</h1>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    {isOnline ? (
                        <Wifi className="w-5 h-5 text-green-500" />
                    ) : (
                        <WifiOff className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>

                <div className="relative">
                    <Bell className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'} cursor-pointer`} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'} transition-colors`}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="font-medium">{user?.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.role}</div>
                </div>
            </div>
        </header>
    );
};

export default Header;