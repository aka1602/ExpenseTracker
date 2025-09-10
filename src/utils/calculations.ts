import { Transaction, CategoryData } from "../types/transaction";
import { CATEGORY_COLORS } from "../constants/categories";
import { TransactionType } from "../constants/enums";

export const calculateCategoryBreakdown = (
  transactions: Transaction[]
): CategoryData[] => {
  const expenseTransactions = transactions.filter(
    (t) => t.type === TransactionType.EXPENSE
  );
  const totalExpenses = expenseTransactions.reduce(
    (sum, t) => sum + t.amount,
    0
  );

  if (totalExpenses === 0) return [];

  const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      color: CATEGORY_COLORS[name as keyof typeof CATEGORY_COLORS] || "#95A5A6",
      percentage: (amount / totalExpenses) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
};

export const getTopCategories = (
  transactions: Transaction[],
  limit: number = 5
): CategoryData[] => {
  const breakdown = calculateCategoryBreakdown(transactions);
  return breakdown.slice(0, limit);
};

export const calculateMonthlyTrend = (
  transactions: Transaction[]
): Record<string, { income: number; expenses: number }> => {
  const monthlyData: Record<string, { income: number; expenses: number }> = {};

  transactions.forEach((transaction) => {
    const dateObj =
      typeof transaction.date === "string"
        ? new Date(transaction.date)
        : transaction.date;
    const monthKey = dateObj.toISOString().slice(0, 7); // YYYY-MM format

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }

    if (transaction.type === TransactionType.INCOME) {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += transaction.amount;
    }
  });

  return monthlyData;
};
