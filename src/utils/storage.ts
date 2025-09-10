import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "../types/transaction";

const TRANSACTIONS_KEY = "@expense_tracker_transactions";

export const saveTransactions = async (
  transactions: Transaction[]
): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(
      transactions.map((t) => ({
        ...t,
        date: t.date.toISOString(),
      }))
    );
    await AsyncStorage.setItem(TRANSACTIONS_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving transactions:", error);
    throw new Error("Failed to save transactions");
  }
};

export const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    if (jsonValue === null) {
      return [];
    }

    const parsedTransactions = JSON.parse(jsonValue);
    return parsedTransactions.map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));
  } catch (error) {
    console.error("Error loading transactions:", error);
    return [];
  }
};

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TRANSACTIONS_KEY);
  } catch (error) {
    console.error("Error clearing data:", error);
    throw new Error("Failed to clear data");
  }
};
