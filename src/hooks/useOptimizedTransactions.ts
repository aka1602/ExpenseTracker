import { useMemo } from "react";
import { Transaction, FilterOptions } from "../types/transaction";

export const useOptimizedTransactions = (
  transactions: Transaction[],
  filters: FilterOptions
) => {
  const filteredTransactions = useMemo(() => {
    if (Object.keys(filters).length === 0) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      // Type filter
      if (
        filters.type &&
        filters.type !== "all" &&
        transaction.type !== filters.type
      ) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Amount filters
      if (
        filters.minAmount !== undefined &&
        transaction.amount < filters.minAmount
      ) {
        return false;
      }

      if (
        filters.maxAmount !== undefined &&
        transaction.amount > filters.maxAmount
      ) {
        return false;
      }

      // Date filters
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }

      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [transactions, filters]);

  const balanceSummary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    };
  }, [filteredTransactions]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [filteredTransactions]);

  return {
    filteredTransactions: sortedTransactions,
    balanceSummary,
  };
};
