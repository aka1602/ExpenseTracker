import React, { memo, useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Card, Text } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { useAppSelector } from "../../store";
import { selectFilteredTransactions } from "../../store/slices/transactionSlice";
import { selectTheme } from "../../store/slices/themeSlice";
import { calculateCategoryBreakdown } from "../../utils/calculations";
import { formatCurrency, formatPercentage } from "../../utils/formatters";
import { TransactionType } from "../../constants/enums";

const { width: screenWidth } = Dimensions.get("window");

interface SpendingChartProps {
  showLegend?: boolean;
  height?: number;
}

const SpendingChart: React.FC<SpendingChartProps> = memo(
  ({ showLegend = true, height = 220 }) => {
    const theme = useAppSelector(selectTheme);
    const filteredTransactions = useAppSelector(selectFilteredTransactions);

    const chartData = useMemo(() => {
      const categoryBreakdown = calculateCategoryBreakdown(
        filteredTransactions
      );

      if (categoryBreakdown.length === 0) {
        return [];
      }

      // Show top 5 categories and group others
      const topCategories = categoryBreakdown.slice(0, 5);
      const otherCategories = categoryBreakdown.slice(5);

      const chartItems = topCategories.map((category) => ({
        name: category.name,
        amount: category.amount,
        color: category.color,
        legendFontColor: theme.colors.onSurface,
        legendFontSize: 12,
      }));

      if (otherCategories.length > 0) {
        const otherTotal = otherCategories.reduce(
          (sum, cat) => sum + cat.amount,
          0
        );
        chartItems.push({
          name: "Others",
          amount: otherTotal,
          color: "#95A5A6",
          legendFontColor: theme.colors.onSurface,
          legendFontSize: 12,
        });
      }

      return chartItems;
    }, [filteredTransactions, theme.colors.onSurface]);

    const chartConfig = {
      backgroundGradientFrom: theme.colors.surface,
      backgroundGradientTo: theme.colors.surface,
      color: (opacity = 1) => theme.colors.primary,
      strokeWidth: 2,
      barPercentage: 0.5,
      useShadowColorFromDataset: false,
    };

    const totalExpenses = useMemo(() => {
      return filteredTransactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
    }, [filteredTransactions]);

    if (chartData.length === 0) {
      return (
        <Card style={styles.card}>
          <Card.Content style={styles.emptyContent}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Expense Data
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              Add some expense transactions to see the spending breakdown
            </Text>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Text variant="titleLarge" style={styles.title}>
              Spending Breakdown
            </Text>
            <Text variant="bodyMedium" style={styles.total}>
              Total: {formatCurrency(totalExpenses)}
            </Text>
          </View>

           <View style={styles.chartContainer}>
             <PieChart
               data={chartData}
               width={screenWidth - 60}
               height={height}
               chartConfig={chartConfig}
               accessor="amount"
               backgroundColor="transparent"
               paddingLeft="0"
               center={[0, 0]}
               hasLegend={false}
             />
           </View>
           
           <View style={styles.legend}>
             {chartData.map((item, index) => (
               <View key={index} style={styles.legendItem}>
                 <View
                   style={[
                     styles.legendColor,
                     { backgroundColor: item.color },
                   ]}
                 />
                 <Text variant="bodyMedium" style={styles.legendText}>
                   {formatPercentage((item.amount / totalExpenses) * 100)} {item.name}
                 </Text>
                 <Text variant="bodySmall" style={styles.legendAmount}>
                   {formatCurrency(item.amount)}
                 </Text>
               </View>
             ))}
           </View>

        </Card.Content>
      </Card>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    margin: 16,
    borderRadius: 16,
    elevation: 3,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  total: {
    opacity: 0.7,
  },
  chartContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  legend: {
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
    fontWeight: "500",
  },
  legendAmount: {
    fontWeight: "600",
    opacity: 0.8,
  },
  emptyContent: {
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: "center",
    opacity: 0.7,
  },
});

SpendingChart.displayName = "SpendingChart";

export default SpendingChart;
