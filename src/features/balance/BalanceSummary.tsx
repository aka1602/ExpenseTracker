import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { useAppSelector } from "../../store";
import { selectBalanceSummary } from "../../store/slices/transactionSlice";
import { TransactionType } from "../../constants/enums";
import AmountDisplay from "../../components/atoms/AmountDisplay";

const BalanceSummary: React.FC = memo(() => {
  const { totalBalance, totalIncome, totalExpenses } = useAppSelector(selectBalanceSummary);

  return (
    <Card style={styles.card} elevation={2}>
      <Card.Content style={styles.content}>
        <View style={styles.balanceSection}>
          <Text variant="titleMedium" style={styles.label}>
            Total Balance
          </Text>
          <AmountDisplay amount={totalBalance} type="balance" size="large" />
        </View>

        <Divider style={styles.divider} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              Income
            </Text>
            <AmountDisplay amount={totalIncome} type={TransactionType.INCOME} size="medium" />
          </View>

          <View style={styles.summaryItem}>
            <Text variant="bodyMedium" style={styles.summaryLabel}>
              Expenses
            </Text>
            <AmountDisplay
              amount={totalExpenses}
              type={TransactionType.EXPENSE}
              size="medium"
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 3,
  },
  content: {
    padding: 24,
  },
  balanceSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
  },
  label: {
    marginBottom: 12,
    opacity: 0.8,
    fontWeight: "500",
  },
  divider: {
    marginVertical: 20,
    height: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    marginBottom: 8,
    opacity: 0.8,
    fontWeight: "500",
  },
});

BalanceSummary.displayName = "BalanceSummary";

export default BalanceSummary;
