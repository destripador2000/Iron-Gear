export interface SalesReport {
  total_sales: number;
  status_filter?: string;
}

export interface TopProduct {
  product_id: number;
  name: string;
  total_sold: number;
}

export interface TopClient {
  user_id: number;
  name: string;
  email?: string;
  order_count: number;
}

export interface InventoryAlert {
  id: number;
  name: string;
  stock: number;
  category: string;
}

export interface ReportsApiResponse<T> {
  data: T | null;
  error: string | null;
  status?: number;
}