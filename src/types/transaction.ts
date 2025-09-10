import { TransactionType } from '../constants/enums';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string | Date;
  description?: string;
}

export interface TransactionFormData {
  amount: string;
  category: string;
  type: TransactionType;
  description?: string;
}

export interface BalanceSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface FilterOptions {
  type?: TransactionType | 'all';
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}
