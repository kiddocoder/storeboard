export interface Category {
  id: string;
  name: string;
  parentId?: string;
  description: string;
  active: boolean;
  createdAt: Date;
}