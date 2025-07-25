import Dexie from 'dexie';
import type { Table } from 'dexie';

import type { 
  User, Store, Product, Category, StoreProduct, Transaction, 
  Invoice, Notification, StockMovement, Customer, Supplier, AppSettings 
} from '../types/types';

export class StoreDatabase extends Dexie {
  users!: Table<User>;
  stores!: Table<Store>;  
  products!: Table<Product>;
  categories!: Table<Category>;
  storeProducts!: Table<StoreProduct>;
  transactions!: Table<Transaction>;
  invoices!: Table<Invoice>;
  notifications!: Table<Notification>;
  stockMovements!: Table<StockMovement>;
  customers!: Table<Customer>;
  suppliers!: Table<Supplier>;
  settings!: Table<AppSettings>;

  constructor() {
    super('StoreManagementDB');
    
    this.version(1).stores({
      users: '++id, email, role, active',
      stores: '++id, name, active, manager',
      products: '++id, name, barcode, categoryId, supplier, active',
      categories: '++id, name, parentId, active',
      storeProducts: '++id, productId, storeId, stock, minStock',
      transactions: '++id, type, productId, storeId, userId, status, createdAt',
      invoices: '++id, type, number, storeId, entityId, status, createdAt',
      notifications: '++id, type, userId, storeId, read, createdAt',
      stockMovements: '++id, productId, storeId, transactionId, createdAt',
      customers: '++id, name, email, phone, active',
      suppliers: '++id, name, email, phone, active',
      settings: '++id'
    });
  }
}

export const db = new StoreDatabase();

// Database service functions
export class DatabaseService {
  // Generic CRUD operations
  static async create<T>(table: Table<T>, data: Omit<T, 'id'>): Promise<string> {
    const id = await table.add(data as T);
    return id.toString();
  }

  static async update<T>(table: Table<T>, id: string, data: Partial<T>): Promise<void> {
    await table.update(id, data);
  }

  static async delete<T>(table: Table<T>, id: string): Promise<void> {
    await table.delete(id);
  }

  static async getById<T>(table: Table<T>, id: string): Promise<T | undefined> {
    return await table.get(id);
  }

  static async getAll<T>(table: Table<T>): Promise<T[]> {
    return await table.toArray();
  }

  // User operations
  static async createUser(userData: Omit<User, 'id'>): Promise<string> {
    return this.create(db.users, userData);
  }

  static async getUserByEmail(email: string): Promise<User | undefined> {
    return await db.users.where('email').equals(email).first();
  }

  static async getActiveUsers(): Promise<User[]> {
    return await db.users.where('active').equals(true).toArray();
  }

  // Store operations
  static async getActiveStores(): Promise<Store[]> {
    return await db.stores.where('active').equals(true).toArray();
  }

  // Product operations
  static async getProductsByStore(storeId: string): Promise<(Product & StoreProduct)[]> {
    const storeProducts = await db.storeProducts.where('storeId').equals(storeId).toArray();
    const products = await Promise.all(
      storeProducts.map(async (sp) => {
        const product = await db.products.get(sp.productId);
        return product ? { ...product, ...sp } : null;
      })
    );
    return products.filter(Boolean) as (Product & StoreProduct)[];
  }

  static async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return await db.products.where('barcode').equals(barcode).first();
  }

  // Transaction operations
  static async createTransaction(transactionData: Omit<Transaction, 'id'>): Promise<string> {
    const transactionId = await this.create(db.transactions, transactionData);
    
    // Update stock levels
    if (transactionData.type === 'sale' || transactionData.type === 'adjustment') {
      await this.updateStockLevel(
        transactionData.storeId,
        transactionData.productId,
        -transactionData.quantity,
        transactionId,
        transactionData.userId
      );
    } else if (transactionData.type === 'purchase') {
      await this.updateStockLevel(
        transactionData.storeId,
        transactionData.productId,
        transactionData.quantity,
        transactionId,
        transactionData.userId
      );
    }
    
    return transactionId;
  }

  static async getTransactionsByStore(storeId: string, limit?: number): Promise<Transaction[]> {
    let query = db.transactions.where('storeId').equals(storeId).orderBy('createdAt').reverse();
    if (limit) {
      query = query.limit(limit);
    }
    return await query.toArray();
  }

  // Stock operations
  static async updateStockLevel(
    storeId: string, 
    productId: string, 
    quantityChange: number, 
    transactionId: string,
    userId: string
  ): Promise<void> {
    const storeProduct = await db.storeProducts
      .where('[productId+storeId]')
      .equals([productId, storeId])
      .first();

    if (storeProduct) {
      const previousStock = storeProduct.stock;
      const newStock = Math.max(0, previousStock + quantityChange);
      
      await db.storeProducts.update(storeProduct.id, {
        stock: newStock,
        lastUpdated: new Date(),
        updatedBy: userId
      });

      // Record stock movement
      await this.create(db.stockMovements, {
        productId,
        storeId,
        transactionId,
        type: quantityChange > 0 ? 'in' : 'out',
        quantity: Math.abs(quantityChange),
        previousStock,
        newStock,
        reason: quantityChange > 0 ? 'Stock In' : 'Stock Out',
        userId,
        createdAt: new Date()
      });

      // Check for low stock and create notification
      if (newStock <= storeProduct.minStock) {
        await this.createLowStockNotification(storeId, productId, newStock, storeProduct.minStock);
      }
    }
  }

  static async createLowStockNotification(
    storeId: string, 
    productId: string, 
    currentStock: number, 
    minStock: number
  ): Promise<void> {
    const product = await db.products.get(productId);
    if (product) {
      await this.create(db.notifications, {
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${product.name} is running low (${currentStock}/${minStock})`,
        read: false,
        storeId,
        metadata: { productId, currentStock, minStock },
        createdAt: new Date()
      });
    }
  }

  // Notification operations
  static async getUnreadNotifications(userId?: string, storeId?: string): Promise<Notification[]> {
    let query = db.notifications.where('read').equals(false);
    
    if (userId) {
      query = query.and(n => !n.userId || n.userId === userId);
    }
    if (storeId) {
      query = query.and(n => !n.storeId || n.storeId === storeId);
    }
    
    return await query.orderBy('createdAt').reverse().toArray();
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    await db.notifications.update(notificationId, { read: true });
  }

  // Data export/import
  static async exportData(): Promise<string> {
    const data = {
      users: await db.users.toArray(),
      stores: await db.stores.toArray(),
      products: await db.products.toArray(),
      categories: await db.categories.toArray(),
      storeProducts: await db.storeProducts.toArray(),
      transactions: await db.transactions.toArray(),
      invoices: await db.invoices.toArray(),
      customers: await db.customers.toArray(),
      suppliers: await db.suppliers.toArray(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Clear existing data
      await db.transaction('rw', [
        db.users, db.stores, db.products, db.categories,
        db.storeProducts, db.transactions, db.invoices,
        db.customers, db.suppliers
      ], async () => {
        await db.users.clear();
        await db.stores.clear();
        await db.products.clear();
        await db.categories.clear();
        await db.storeProducts.clear();
        await db.transactions.clear();
        await db.invoices.clear();
        await db.customers.clear();
        await db.suppliers.clear();

        // Import new data
        if (data.users) await db.users.bulkAdd(data.users);
        if (data.stores) await db.stores.bulkAdd(data.stores);
        if (data.products) await db.products.bulkAdd(data.products);
        if (data.categories) await db.categories.bulkAdd(data.categories);
        if (data.storeProducts) await db.storeProducts.bulkAdd(data.storeProducts);
        if (data.transactions) await db.transactions.bulkAdd(data.transactions);
        if (data.invoices) await db.invoices.bulkAdd(data.invoices);
        if (data.customers) await db.customers.bulkAdd(data.customers);
        if (data.suppliers) await db.suppliers.bulkAdd(data.suppliers);
      });
    } catch (error) {
      throw new Error('Invalid data format');
    }
  }
}