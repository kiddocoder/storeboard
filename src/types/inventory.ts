export interface StockMovement {
  id: string;
  productId: string;
  storeId: string;
  transactionId: string;
  type: 'in' | 'out';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: string;
  createdAt: Date;
}
