

export interface Product {
  id: string;
  name: string;
  description: string;
  barcode: string;
  qrCode?: string;
  categoryId: string;
  brand: string;
  supplier: string;
  tags: string[];
  active: boolean;
  images: string[];
  specifications: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}



export interface StoreProduct {
  id: string;
  productId: string;
  storeId: string;
  stock: number;
  minStock: number;
  maxStock: number;
  purchasePrice: number;
  sellingPrice: number;
  wholesalePrice?: number;
  location?: string;
  batch?: string;
  expiryDate?: Date;
  lastUpdated: Date;
  updatedBy: string;
}
