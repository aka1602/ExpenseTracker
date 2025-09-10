import React, { memo, useCallback } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { Transaction } from "../../types/transaction";
import TransactionItem from "./TransactionItem";
import { useAppSelector } from "../../store";
import { selectFilteredTransactions, selectIsLoading } from "../../store/slices/transactionSlice";

interface TransactionListProps {
  onEditTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;
  onTransactionPress?: (transaction: Transaction) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

const TransactionList: React.FC<TransactionListProps> = memo(
  ({
    onEditTransaction,
    onDeleteTransaction,
    onTransactionPress,
    ListHeaderComponent,
  }) => {
    const filteredTransactions = useAppSelector(selectFilteredTransactions);
    const isLoading = useAppSelector(selectIsLoading);

    const renderTransaction = useCallback(
      ({ item }: { item: Transaction }) => (
        <TransactionItem
          transaction={item}
          onEdit={onEditTransaction}
          onDelete={onDeleteTransaction}
          onPress={onTransactionPress}
        />
      ),
      [onEditTransaction, onDeleteTransaction, onTransactionPress]
    );

    const renderEmpty = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No transactions found
          </Text>
          <Text variant="bodyMedium" style={styles.emptySubtext}>
            Add your first transaction to get started
          </Text>
        </View>
      ),
      []
    );

    const keyExtractor = useCallback((item: Transaction) => item.id, []);

    const getItemLayout = useCallback(
      (data: any, index: number) => ({
        length: 100, // Approximate item height
        offset: 100 * index,
        index,
      }),
      []
    );

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            Loading transactions...
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={ListHeaderComponent}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: "center",
    opacity: 0.7,
  },
});

TransactionList.displayName = "TransactionList";

export default TransactionList;
