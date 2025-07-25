
import { createContext, useReducer, useState } from "react";
import type { ReactNode } from "react"

import type { Product, StoreProduct } from "../types/products";
import type { Store } from "../types/stores";
import type { User } from "../types/users";
import type { Transaction } from "../types/transactions";
import type { Notification } from "../types/notifications";
import type { Category } from "../types/categories";
import type { Invoice } from "../types/invoices";

interface AppContextType {
    user: User | null;
    stores: Store[];
    products: Product[];
    categories: Category[];
    storeProducts: StoreProduct[];
    transactions: Transaction[];
    invoices: Invoice[];
    notifications: Notification[];
    isOnline: boolean;
    selectedStore: string;
    setSelectedStore: (storeId: string) => void;
    darkMode: boolean;
    setDarkMode: (dark: boolean) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [stores, setStores] = useState<Store[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOnline, setIsOnline] = useState(true);
    const [selectedStore, setSelectedStore] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const value = {
        user,
        stores,
        products,
        categories,
        storeProducts,
        transactions,
        invoices,
        notifications,
        isOnline,
        selectedStore,
        setSelectedStore,
        darkMode,
        setDarkMode,
        // Note: If you need to expose setters, add them here
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}