

export interface Transaction {
  id: string;
  type: 'sale' | 'purchase' | 'transfer' | 'adjustment' | 'return' | 'waste';
  productId: string;
  storeId: string;
  fromStoreId?: string;
  toStoreId?: string;
  quantity: number;
  price: number;
  total: number;
  userId: string;
  customerId?: string;
  supplierId?: string;
  invoiceId?: string;
  notes: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}
