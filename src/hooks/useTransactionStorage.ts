import { useCallback } from "react";
import { Transaction } from "../types/transaction";
import { useLocalStorage } from "./useLocalStorage";

const TRANSACTIONS_STORAGE_KEY = "@expense_tracker_transactions";

export function useTransactionStorage() {
  const [transactions, setTransactions, clearTransactions] = useLocalStorage<Transaction[]>(
    TRANSACTIONS_STORAGE_KEY,
    []
  );

  const addTransaction = useCallback(
    async (transaction: Transaction) => {
      await setTransactions((prev) => [...prev, transaction]);
    },
    [setTransactions]
  );

  const updateTransaction = useCallback(
    async (updatedTransaction: Transaction) => {
      await setTransactions((prev) =>
        prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
      );
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    async (transactionId: string) => {
      await setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    },
    [setTransactions]
  );

  const bulkUpdateTransactions = useCallback(
    async (newTransactions: Transaction[]) => {
      await setTransactions(newTransactions);
    },
    [setTransactions]
  );

  const getTransactionById = useCallback(
    (id: string): Transaction | undefined => {
      return transactions.find((t) => t.id === id);
    },
    [transactions]
  );

  const getTransactionsByCategory = useCallback(
    (category: string): Transaction[] => {
      return transactions.filter((t) => t.category === category);
    },
    [transactions]
  );

  const getTransactionsByType = useCallback(
    (type: "income" | "expense"): Transaction[] => {
      return transactions.filter((t) => t.type === type);
    },
    [transactions]
  );

  const getTransactionsByDateRange = useCallback(
    (startDate: Date, endDate: Date): Transaction[] => {
      return transactions.filter((t) => t.date >= startDate && t.date <= endDate);
    },
    [transactions]
  );

  const getTotalsByType = useCallback(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactions]);

  const getMonthlyTotals = useCallback((year: number, month: number) => {
    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: monthTransactions.length,
    };
  }, [transactions]);

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    bulkUpdateTransactions,
    clearTransactions,
    getTransactionById,
    getTransactionsByCategory,
    getTransactionsByType,
    getTransactionsByDateRange,
    getTotalsByType,
    getMonthlyTotals,
  };
}
