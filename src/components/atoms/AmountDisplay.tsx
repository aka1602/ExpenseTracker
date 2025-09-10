import React, { memo } from "react";
import { Text } from "react-native-paper";
import { StyleSheet, TextStyle } from "react-native";
import { formatCurrency } from "../../utils/formatters";
import { useAppSelector } from "../../store";
import { selectTheme } from "../../store/slices/themeSlice";
import { TransactionType } from "../../constants/enums";

interface AmountDisplayProps {
  amount: number;
  type?: TransactionType | "balance";
  size?: "small" | "medium" | "large";
  style?: TextStyle;
}

const AmountDisplay: React.FC<AmountDisplayProps> = memo(
  ({ amount, type = "balance", size = "medium", style }) => {
    const theme = useAppSelector(selectTheme);

    const getColor = () => {
      switch (type) {
        case TransactionType.INCOME:
          return theme.colors.income;
        case TransactionType.EXPENSE:
          return theme.colors.expense;
        case "balance":
          return amount >= 0 ? theme.colors.income : theme.colors.expense;
        default:
          return theme.colors.text;
      }
    };

    const getSize = () => {
      switch (size) {
        case "small":
          return styles.small;
        case "large":
          return styles.large;
        default:
          return styles.medium;
      }
    };

    const displayAmount = type === TransactionType.EXPENSE ? Math.abs(amount) : amount;
    const prefix = type === TransactionType.EXPENSE ? "-" : type === TransactionType.INCOME ? "+" : "";

    return (
      <Text
        style={[styles.amount, getSize(), { color: getColor() }, style]}
        variant={
          size === "large"
            ? "headlineMedium"
            : size === "small"
            ? "bodyMedium"
            : "titleMedium"
        }
      >
        {prefix}
        {formatCurrency(displayAmount)}
      </Text>
    );
  }
);

const styles = StyleSheet.create({
  amount: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 18,
  },
  large: {
    fontSize: 24,
  },
});

AmountDisplay.displayName = "AmountDisplay";

export default AmountDisplay;
