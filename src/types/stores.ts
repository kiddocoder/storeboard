
export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  active: boolean;
  logo?: string;
  currency: string;
  timezone: string;
  createdAt: Date;
}

export interface StoreProduct {
    id: string;
    productId: string;
    storeId: string;
    stock: number;
    minStock: number;
    purchasePrice: number;
    sellingPrice: number;
    lastUpdated: Date;
}