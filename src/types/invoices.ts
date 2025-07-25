export interface InvoiceItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}


export interface Invoice {
  id: string;
  type: 'supplier' | 'client';
  number: string;
  storeId: string;
  entityId: string;
  entityName: string;
  entityEmail?: string;
  entityPhone?: string;
  entityAddress?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  paid: number;
  balance: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentTerms: string;
  notes: string;
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
}
