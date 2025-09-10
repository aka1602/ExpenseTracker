import React, { memo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { Transaction } from "../../types/transaction";
import { formatDate } from "../../utils/formatters";
import AmountDisplay from "../../components/atoms/AmountDisplay";
import CategoryChip from "../../components/atoms/CategoryChip";
import { useAppSelector } from "../../store";
import { selectTheme } from "../../store/slices/themeSlice";

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  onPress?: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = memo(
  ({ transaction, onEdit, onDelete, onPress }) => {
    const theme = useAppSelector(selectTheme);

    const handlePress = () => {
      onPress?.(transaction);
    };

    const handleEdit = () => {
      onEdit?.(transaction);
    };

    const handleDelete = () => {
      onDelete?.(transaction.id);
    };

    return (
      <Card style={styles.card} elevation={1}>
        <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
          <Card.Content style={styles.content}>
            <View style={styles.header}>
              <View style={styles.leftSection}>
                <Text variant="bodyMedium" style={styles.date}>
                  {formatDate(transaction.date)}
                </Text>
                <CategoryChip category={transaction.category} />
              </View>

              <View style={styles.rightSection}>
                <AmountDisplay
                  amount={transaction.amount}
                  type={transaction.type}
                  size="medium"
                />
              </View>
            </View>

            {transaction.description && (
              <Text
                variant="bodySmall"
                style={[styles.description, { color: theme.colors.onSurface }]}
                numberOfLines={2}
              >
                {transaction.description}
              </Text>
            )}

            {(onEdit || onDelete) && (
              <View style={styles.actions}>
                {onEdit && (
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={handleEdit}
                    style={styles.actionButton}
                  />
                )}
                {onDelete && (
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={handleDelete}
                    style={styles.actionButton}
                    iconColor={theme.colors.error}
                  />
                )}
              </View>
            )}
          </Card.Content>
        </TouchableOpacity>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  date: {
    opacity: 0.7,
    marginBottom: 4,
  },
  description: {
    marginTop: 8,
    opacity: 0.8,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    marginRight: -8,
  },
  actionButton: {
    margin: 0,
  },
});

TransactionItem.displayName = "TransactionItem";

export default TransactionItem;
