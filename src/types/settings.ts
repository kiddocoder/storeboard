export interface AppSettings {
  currency: string;
  timezone: string;
  dateFormat: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    lowStock: boolean;
    newOrders: boolean;
    systemUpdates: boolean;
    email: boolean;
    push: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupInterval: number;
    retentionDays: number;
  };
  pos: {
    receiptTemplate: string;
    printAfterSale: boolean;
    cashDrawer: boolean;
  };
}
