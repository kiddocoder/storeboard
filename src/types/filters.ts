export interface ReportFilter {
  startDate: Date;
  endDate: Date;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  userId?: string;
  transactionType?: string;
}