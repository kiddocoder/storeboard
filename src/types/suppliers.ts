export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  paymentTerms: string;
  active: boolean;
  totalOrders: number;
  lastOrder?: Date;
  createdAt: Date;
}
