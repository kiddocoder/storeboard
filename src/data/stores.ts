import type { Store } from "../types/stores";


export const stores: Store[] = [
  {
    id: '1',
    name: 'Main Store Downtown',
    address: '123 Main St, Downtown',
    phone: '+1-555-0123',
    email: 'main@store.com',
    manager: 'Sarah Manager',
    active: true,
    currency: 'USD',
    timezone: 'America/New_York',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Branch Store Mall',
    address: '456 Mall Ave, Shopping Center',
    phone: '+1-555-0124',
    email: 'branch@store.com',
    manager: 'John Admin',
    active: true,
    currency: 'USD',
    timezone: 'America/New_York',
    createdAt: new Date('2024-01-15')
  }
];
