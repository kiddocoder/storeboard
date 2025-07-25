import React, { useContext } from 'react';
import { AppContext } from '../../contexts/app';
import { Home, Store, Package, Archive, Receipt, FileText, Users, BarChart3, Scan, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SideNav: React.FC<{ isOpen: boolean; onClose: () => void; activeView: string; setActiveView: (view: string) => void }> = ({
    isOpen, onClose, activeView, setActiveView
}) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { user, darkMode } = context;

    const menuItems = [
        { id: '/', label: 'Dashboard', icon: Home, roles: ['Admin', 'Manager', 'Cashier', 'Viewer'] },
        { id: 'stores', label: 'Stores', icon: Store, roles: ['Admin', 'Manager'] },
        { id: 'products', label: 'Products', icon: Package, roles: ['Admin', 'Manager', 'Cashier'] },
        { id: 'inventory', label: 'Inventory', icon: Archive, roles: ['Admin', 'Manager', 'Cashier'] },
        { id: 'transactions', label: 'Transactions', icon: Receipt, roles: ['Admin', 'Manager', 'Cashier'] },
        { id: 'invoices', label: 'Invoices', icon: FileText, roles: ['Admin', 'Manager', 'Cashier'] },
        { id: 'users', label: 'Users', icon: Users, roles: ['Admin'] },
        { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['Admin', 'Manager'] },
        { id: 'scanner', label: 'Scanner', icon: Scan, roles: ['Admin', 'Manager', 'Cashier'] },
        { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Manager'] }
    ];

    // const filteredMenuItems = menuItems.filter(item =>
    //     user?.role && item.roles.includes(user.role)
    // );

    const filteredMenuItems = menuItems;

    const navigate = useNavigate();

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />
            )}

            <aside className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:static inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-200 ease-in-out md:translate-x-0`}>

                <div className="flex items-center justify-between p-4 md:hidden">
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
                    <button onClick={onClose} className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="mt-4 px-4">
                    <ul

                        className="space-y-2">
                        {filteredMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li
                                    onClick={() => navigate(`${item.id}`)}
                                    key={item.id}>
                                    <button
                                        onClick={() => {
                                            setActiveView(item.id);
                                            onClose();
                                        }}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeView === item.id
                                                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
                                                : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default SideNav;