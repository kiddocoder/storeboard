export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  totalPurchases: number;
  lastPurchase?: Date;
  loyalty: 'bronze' | 'silver' | 'gold' | 'platinum';
  active: boolean;
  createdAt: Date;
}
