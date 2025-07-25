

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Cashier' | 'Viewer';
    storeAccess: string[];
    active: boolean;
    createdAt: Date;
    lastLogin?:Date;
}