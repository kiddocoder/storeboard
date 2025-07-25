


export interface Notification {
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
}