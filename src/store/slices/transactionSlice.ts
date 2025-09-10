import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  Transaction,
  FilterOptions,
  BalanceSummary,
} from "../../types/transaction";
import { StorageKeys, TransactionType, Messages } from "../../constants/enums";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  filters: {},
  isLoading: false,
  error: null,
};

export const loadTransactions = createAsyncThunk(
  "transactions/loadTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const jsonValue = await AsyncStorage.getItem(StorageKeys.TRANSACTIONS);
      if (jsonValue === null) {
        return [];
      }

      const parsedTransactions = JSON.parse(jsonValue);
      return parsedTransactions;
    } catch (error) {
      console.error("Error loading transactions:", error);
      return rejectWithValue("Failed to load transactions");
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (transactionData: Omit<Transaction, "id">, { getState }) => {
    const transaction: Transaction = {
      ...transactionData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: transactionData.date.toISOString() as any,
    };

    const state = getState() as { transactions: TransactionState };
    const newTransactions = [...state.transactions.transactions, transaction];

    // Save to storage
    try {
      const jsonValue = JSON.stringify(newTransactions);
      await AsyncStorage.setItem(StorageKeys.TRANSACTIONS, jsonValue);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }

    return transaction;
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async (transaction: Transaction, { getState }) => {
    const updatedTransaction = {
      ...transaction,
      date:
        typeof transaction.date === "string"
          ? transaction.date
          : transaction.date.toISOString(),
    };

    const state = getState() as { transactions: TransactionState };
    const updatedTransactions = state.transactions.transactions.map((t) =>
      t.id === transaction.id ? updatedTransaction : t
    );

    // Save to storage
    try {
      const jsonValue = JSON.stringify(updatedTransactions);
      await AsyncStorage.setItem(StorageKeys.TRANSACTIONS, jsonValue);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }

    return updatedTransaction;
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { getState }) => {
    const state = getState() as { transactions: TransactionState };
    const remainingTransactions = state.transactions.transactions.filter(
      (t) => t.id !== id
    );

    // Save to storage
    try {
      const jsonValue = JSON.stringify(remainingTransactions);
      await AsyncStorage.setItem(StorageKeys.TRANSACTIONS, jsonValue);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }

    return id;
  }
);

export const clearAllTransactions = createAsyncThunk(
  "transactions/clearAllTransactions",
  async (_, { dispatch }) => {
    try {
      await AsyncStorage.removeItem(StorageKeys.TRANSACTIONS);
      return [];
    } catch (error) {
      console.error("Error clearing transactions:", error);
      throw error;
    }
  }
);

const applyFilters = (
  transactions: Transaction[],
  filters: FilterOptions
): Transaction[] => {
  return transactions.filter((transaction) => {
    if (
      filters.type &&
      filters.type !== "all" &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

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

    const transactionDate =
      typeof transaction.date === "string"
        ? new Date(transaction.date)
        : transaction.date;

    if (filters.dateFrom && transactionDate < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && transactionDate > filters.dateTo) {
      return false;
    }

    return true;
  });
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<FilterOptions>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredTransactions = applyFilters(
        state.transactions,
        state.filters
      );
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredTransactions = [...state.transactions];
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.filteredTransactions = applyFilters(
          action.payload,
          state.filters
        );
      })
      .addCase(loadTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.filteredTransactions = applyFilters(
          state.transactions,
          state.filters
        );
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (t) => t.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = action.payload;
          state.filteredTransactions = applyFilters(
            state.transactions,
            state.filters
          );
        }
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
        state.filteredTransactions = applyFilters(
          state.transactions,
          state.filters
        );
      })

      .addCase(clearAllTransactions.fulfilled, (state) => {
        state.transactions = [];
        state.filteredTransactions = [];
      });
  },
});

export const { setFilters, clearFilters, setError } = transactionSlice.actions;

// Selectors
export const selectTransactions = (state: { transactions: TransactionState }) =>
  state.transactions.transactions;
export const selectFilteredTransactions = (state: {
  transactions: TransactionState;
}) => state.transactions.filteredTransactions;
export const selectFilters = (state: { transactions: TransactionState }) =>
  state.transactions.filters;
export const selectIsLoading = (state: { transactions: TransactionState }) =>
  state.transactions.isLoading;
export const selectError = (state: { transactions: TransactionState }) =>
  state.transactions.error;

export const selectBalanceSummary = createSelector(
  [selectFilteredTransactions],
  (filteredTransactions): BalanceSummary => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = filteredTransactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    };
  }
);

export default transactionSlice.reducer;
