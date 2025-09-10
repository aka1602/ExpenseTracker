import React, { memo, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { FAB, Appbar, Snackbar } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../store";
import {
  selectFilteredTransactions,
  selectFilters,
  selectBalanceSummary,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  clearFilters,
  clearAllTransactions,
} from "../store/slices/transactionSlice";
import { Transaction, TransactionFormData } from "../types/transaction";
import { Messages } from "../constants/enums";
import BalanceSummary from "../features/balance/BalanceSummary";
import TransactionList from "../features/transactions/TransactionList";
import TransactionForm from "../features/transactions/TransactionForm";
import FilterModal from "../features/filters/FilterModal";
import SpendingChart from "../components/organisms/SpendingChart";
import ThemeToggle from "../components/molecules/ThemeToggle";
import { clearTransactionsOnly } from "../utils/clearStorage";

const HomeScreen: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const filteredTransactions = useAppSelector(selectFilteredTransactions);
  const filters = useAppSelector(selectFilters);
  const balanceSummary = useAppSelector(selectBalanceSummary);

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);

  const showMessage = useCallback((message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }, []);

  const handleAddTransaction = useCallback(
    async (data: TransactionFormData) => {
      try {
        await dispatch(
          addTransaction({
            amount: Number(data.amount),
            category: data.category,
            type: data.type,
            description: data.description,
            date: new Date(),
          })
        );
        setShowTransactionForm(false);
        showMessage(Messages.TRANSACTION_ADDED);
      } catch (error) {
        showMessage(Messages.FAILED_ADD);
      }
    },
    [dispatch, showMessage]
  );

  const handleUpdateTransaction = useCallback(
    async (data: TransactionFormData) => {
      if (!editingTransaction) return;

      try {
        await dispatch(
          updateTransaction({
            ...editingTransaction,
            amount: Number(data.amount),
            category: data.category,
            type: data.type,
            description: data.description,
          })
        );
        setEditingTransaction(null);
        showMessage(Messages.TRANSACTION_UPDATED);
      } catch (error) {
        showMessage(Messages.FAILED_UPDATE);
      }
    },
    [editingTransaction, dispatch, showMessage]
  );

  const handleDeleteTransaction = useCallback(
    async (id: string) => {
      try {
        await dispatch(deleteTransaction(id));
        showMessage(Messages.TRANSACTION_DELETED);
      } catch (error) {
        showMessage(Messages.FAILED_DELETE);
      }
    },
    [dispatch, showMessage]
  );

  const handleEditTransaction = useCallback((transaction: Transaction) => {
    setEditingTransaction(transaction);
  }, []);

  const handleCloseTransactionForm = useCallback(() => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  }, []);

  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      dispatch(setFilters(newFilters));
      setShowFilterModal(false);
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleClearAllData = useCallback(async () => {
    try {
      await clearTransactionsOnly();
      dispatch(clearAllTransactions());
      showMessage("All transaction data cleared");
    } catch (error) {
      showMessage("Failed to clear data");
    }
  }, [dispatch, showMessage]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content title="Expense Tracker" />
          <Appbar.Action icon="delete-sweep" onPress={handleClearAllData} />
          <Appbar.Action
            icon={hasActiveFilters ? "filter" : "filter-outline"}
            onPress={() => setShowFilterModal(true)}
          />
          <ThemeToggle />
        </Appbar.Header>

        <View style={styles.content}>
          <TransactionList
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            ListHeaderComponent={
              <View>
                <BalanceSummary />
                <SpendingChart />
              </View>
            }
          />
        </View>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setShowTransactionForm(true)}
        />

        <TransactionForm
          visible={showTransactionForm || !!editingTransaction}
          onDismiss={handleCloseTransactionForm}
          onSubmit={
            editingTransaction ? handleUpdateTransaction : handleAddTransaction
          }
          initialData={
            editingTransaction
              ? {
                  amount: editingTransaction.amount.toString(),
                  category: editingTransaction.category,
                  type: editingTransaction.type,
                  description: editingTransaction.description,
                }
              : undefined
          }
          title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        />

        <FilterModal
          visible={showFilterModal}
          onDismiss={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          currentFilters={filters}
        />

        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </SafeAreaView>
    </SafeAreaProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

HomeScreen.displayName = "HomeScreen";

export default HomeScreen;
