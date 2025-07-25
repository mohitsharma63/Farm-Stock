export interface DashboardStats {
  companies: number;
  inventory: number;
  customers: number;
  coldStorage: number;
}

export interface RecentTransaction {
  id: string;
  description: string;
  type: 'IN' | 'OUT' | 'TRANSFER';
  amount: string;
  value: string;
  date: string;
}

export interface SystemAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  children?: NavigationItem[];
}
