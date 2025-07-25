import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    User, Store, Product, Category, StoreProduct, Transaction,
    Invoice, Notification, Customer, Supplier, DashboardStats
} from '../types';
import { DatabaseService, db } from '../services/database';
import {
    mockUsers, mockStores, mockProducts, mockCategories,
    mockStoreProducts, mockTransactions, mockCustomers,
    mockSuppliers, mockNotifications
} from '../services/mockData';

interface AppState {
    user: User | null;
    stores: Store[];
    products: Product[];
    categories: Category[];
    storeProducts: StoreProduct[];
    transactions: Transaction[];
    invoices: Invoice[];
    customers: Customer[];
    suppliers: Supplier[];
    notifications: Notification[];
    isOnline: boolean;
    selectedStore: string;
    darkMode: boolean;
    loading: boolean;
    syncing: boolean;
    stats: DashboardStats | null;
}

type AppAction =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_STORES'; payload: Store[] }
    | { type: 'SET_PRODUCTS'; payload: Product[] }
    | { type: 'SET_CATEGORIES'; payload: Category[] }
    | { type: 'SET_STORE_PRODUCTS'; payload: StoreProduct[] }
    | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'SET_INVOICES'; payload: Invoice[] }
    | { type: 'SET_CUSTOMERS'; payload: Customer[] }
    | { type: 'SET_SUPPLIERS'; payload: Supplier[] }
    | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
    | { type: 'SET_ONLINE_STATUS'; payload: boolean }
    | { type: 'SET_SELECTED_STORE'; payload: string }
    | { type: 'SET_DARK_MODE'; payload: boolean }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_SYNCING'; payload: boolean }
    | { type: 'SET_STATS'; payload: DashboardStats }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'MARK_NOTIFICATION_READ'; payload: string };

const initialState: AppState = {
    user: null,
    stores: [],
    products: [],
    categories: [],
    storeProducts: [],
    transactions: [],
    invoices: [],
    customers: [],
    suppliers: [],
    notifications: [],
    isOnline: navigator.onLine,
    selectedStore: '',
    darkMode: localStorage.getItem('darkMode') === 'true',
    loading: true,
    syncing: false,
    stats: null
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_STORES':
            return { ...state, stores: action.payload };
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload };
        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload };
        case 'SET_STORE_PRODUCTS':
            return { ...state, storeProducts: action.payload };
        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };
        case 'SET_INVOICES':
            return { ...state, invoices: action.payload };
        case 'SET_CUSTOMERS':
            return { ...state, customers: action.payload };
        case 'SET_SUPPLIERS':
            return { ...state, suppliers: action.payload };
        case 'SET_NOTIFICATIONS':
            return { ...state, notifications: action.payload };
        case 'SET_ONLINE_STATUS':
            return { ...state, isOnline: action.payload };
        case 'SET_SELECTED_STORE':
            return { ...state, selectedStore: action.payload };
        case 'SET_DARK_MODE':
            localStorage.setItem('darkMode', action.payload.toString());
            return { ...state, darkMode: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_SYNCING':
            return { ...state, syncing: action.payload };
        case 'SET_STATS':
            return { ...state, stats: action.payload };
        case 'ADD_NOTIFICATION':
            return { ...state, notifications: [action.payload, ...state.notifications] };
        case 'MARK_NOTIFICATION_READ':
            return {
                ...state,
                notifications: state.notifications.map(n =>
                    n.id === action.payload ? { ...n, read: true } : n
                )
            };
        default:
            return state;
    }
}

interface AppContextType extends AppState {
    dispatch: React.Dispatch<AppAction>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    selectStore: (storeId: string) => void;
    toggleDarkMode: () => void;
    createTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    refreshData: () => Promise<void>;
    exportData: () => Promise<string>;
    importData: (jsonData: string) => Promise<void>;
    calculateStats: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Initialize database and load data
    useEffect(() => {
        const initializeApp = async () => {
            dispatch({ type: 'SET_LOADING', payload: true });

            try {
                // Check if database has data, if not populate with mock data
                const existingUsers = await DatabaseService.getAll(db.users);

                if (existingUsers.length === 0) {
                    // Populate with mock data
                    await db.users.bulkAdd(mockUsers);
                    await db.stores.bulkAdd(mockStores);
                    await db.categories.bulkAdd(mockCategories);
                    await db.products.bulkAdd(mockProducts);
                    await db.storeProducts.bulkAdd(mockStoreProducts);
                    await db.transactions.bulkAdd(mockTransactions);
                    await db.customers.bulkAdd(mockCustomers);
                    await db.suppliers.bulkAdd(mockSuppliers);
                    await db.notifications.bulkAdd(mockNotifications);
                }

                // Load data from database
                const [stores, products, categories, storeProducts, transactions, customers, suppliers, notifications] = await Promise.all([
                    DatabaseService.getAll(db.stores),
                    DatabaseService.getAll(db.products),
                    DatabaseService.getAll(db.categories),
                    DatabaseService.getAll(db.storeProducts),
                    DatabaseService.getAll(db.transactions),
                    DatabaseService.getAll(db.customers),
                    DatabaseService.getAll(db.suppliers),
                    DatabaseService.getAll(db.notifications)
                ]);

                dispatch({ type: 'SET_STORES', payload: stores });
                dispatch({ type: 'SET_PRODUCTS', payload: products });
                dispatch({ type: 'SET_CATEGORIES', payload: categories });
                dispatch({ type: 'SET_STORE_PRODUCTS', payload: storeProducts });
                dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
                dispatch({ type: 'SET_CUSTOMERS', payload: customers });
                dispatch({ type: 'SET_SUPPLIERS', payload: suppliers });
                dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });

                // Auto-login with mock user for demo
                dispatch({ type: 'SET_USER', payload: mockUsers[0] });

                // Set first store as selected
                if (stores.length > 0) {
                    dispatch({ type: 'SET_SELECTED_STORE', payload: stores[0].id });
                }

            } catch (error) {
                console.error('Failed to initialize app:', error);
            } finally {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initializeApp();
    }, []);

    // Monitor online status
    useEffect(() => {
        const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
        const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Simulate real-time notifications
    useEffect(() => {
        const interval = setInterval(async () => {
            // Check for low stock items and create notifications
            const lowStockItems = state.storeProducts.filter(sp =>
                sp.storeId === state.selectedStore &&
                sp.stock <= sp.minStock
            );

            for (const item of lowStockItems) {
                const product = state.products.find(p => p.id === item.productId);
                if (product) {
                    const existingNotification = state.notifications.find(n =>
                        n.type === 'warning' &&
                        n.metadata?.productId === item.productId &&
                        !n.read
                    );

                    if (!existingNotification) {
                        const notification: Notification = {
                            id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            type: 'warning',
                            title: 'Low Stock Alert',
                            message: `${product.name} is running low (${item.stock}/${item.minStock})`,
                            read: false,
                            storeId: item.storeId,
                            metadata: {
                                productId: item.productId,
                                currentStock: item.stock,
                                minStock: item.minStock
                            },
                            createdAt: new Date()
                        };

                        await DatabaseService.create(db.notifications, notification);
                        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
                    }
                }
            }
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, [state.storeProducts, state.products, state.selectedStore, state.notifications]);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const user = await DatabaseService.getUserByEmail(email);
            if (user && user.active) {
                dispatch({ type: 'SET_USER', payload: user });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const logout = () => {
        dispatch({ type: 'SET_USER', payload: null });
    };

    const selectStore = (storeId: string) => {
        dispatch({ type: 'SET_SELECTED_STORE', payload: storeId });
    };

    const toggleDarkMode = () => {
        dispatch({ type: 'SET_DARK_MODE', payload: !state.darkMode });
    };

    const createTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
        try {
            const transactionId = await DatabaseService.createTransaction(transactionData);

            // Refresh transactions and store products
            const [transactions, storeProducts] = await Promise.all([
                DatabaseService.getAll(db.transactions),
                DatabaseService.getAll(db.storeProducts)
            ]);

            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
            dispatch({ type: 'SET_STORE_PRODUCTS', payload: storeProducts });

            // Create success notification
            const notification: Notification = {
                id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: 'success',
                title: 'Transaction Completed',
                message: `${transactionData.type.charAt(0).toUpperCase() + transactionData.type.slice(1)} of $${transactionData.total.toLocaleString()} completed`,
                read: false,
                userId: transactionData.userId,
                storeId: transactionData.storeId,
                metadata: { transactionId, amount: transactionData.total },
                createdAt: new Date()
            };

            await DatabaseService.create(db.notifications, notification);
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification });

        } catch (error) {
            console.error('Failed to create transaction:', error);
            throw error;
        }
    };

    const refreshData = async () => {
        dispatch({ type: 'SET_SYNCING', payload: true });

        try {
            const [stores, products, categories, storeProducts, transactions, customers, suppliers, notifications] = await Promise.all([
                DatabaseService.getAll(db.stores),
                DatabaseService.getAll(db.products),
                DatabaseService.getAll(db.categories),
                DatabaseService.getAll(db.storeProducts),
                DatabaseService.getAll(db.transactions),
                DatabaseService.getAll(db.customers),
                DatabaseService.getAll(db.suppliers),
                DatabaseService.getAll(db.notifications)
            ]);

            dispatch({ type: 'SET_STORES', payload: stores });
            dispatch({ type: 'SET_PRODUCTS', payload: products });
            dispatch({ type: 'SET_CATEGORIES', payload: categories });
            dispatch({ type: 'SET_STORE_PRODUCTS', payload: storeProducts });
            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
            dispatch({ type: 'SET_CUSTOMERS', payload: customers });
            dispatch({ type: 'SET_SUPPLIERS', payload: suppliers });
            dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });

        } catch (error) {
            console.error('Failed to refresh data:', error);
        } finally {
            dispatch({ type: 'SET_SYNCING', payload: false });
        }
    };

    const exportData = async (): Promise<string> => {
        return await DatabaseService.exportData();
    };

    const importData = async (jsonData: string) => {
        await DatabaseService.importData(jsonData);
        await refreshData();
    };

    const calculateStats = async (): Promise<void> => {
        const { transactions, storeProducts, customers } = state;
        const storeTransactions = transactions.filter(t => t.storeId === state.selectedStore);
        const storeInventory = storeProducts.filter(sp => sp.storeId === state.selectedStore);

        const totalSales = storeTransactions
            .filter(t => t.type === 'sale')
            .reduce((sum, t) => sum + t.total, 0);

        const totalPurchases = storeTransactions
            .filter(t => t.type === 'purchase')
            .reduce((sum, t) => sum + t.total, 0);

        const profit = totalSales - totalPurchases;
        const totalProducts = storeInventory.length;
        const lowStockItems = storeInventory.filter(sp => sp.stock <= sp.minStock).length;
        const totalCustomers = customers.length;
        const totalOrders = storeTransactions.filter(t => t.type === 'sale').length;
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

        const stats: DashboardStats = {
            totalSales,
            totalPurchases,
            profit,
            totalProducts,
            lowStockItems,
            totalCustomers,
            totalOrders,
            averageOrderValue,
            salesGrowth: 15.5, // Mock calculation
            profitMargin: totalSales > 0 ? (profit / totalSales) * 100 : 0
        };

        dispatch({ type: 'SET_STATS', payload: stats });
    };

    const contextValue: AppContextType = {
        ...state,
        dispatch,
        login,
        logout,
        selectStore,
        toggleDarkMode,
        createTransaction,
        refreshData,
        exportData,
        importData,
        calculateStats
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};