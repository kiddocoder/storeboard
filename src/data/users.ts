import type { User } from "../types/users";

export const users: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@store.com',
    role: 'Admin',
    storeAccess: ['1', '2'],
    active: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@store.com',
    role: 'Manager',
    storeAccess: ['1'],
    active: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date(Date.now() - 86400000)
  },
  {
    id: '3',
    name: 'Mike Cashier',
    email: 'cashier@store.com',
    role: 'Cashier',
    storeAccess: ['1'],
    active: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 3600000)
  }
];
