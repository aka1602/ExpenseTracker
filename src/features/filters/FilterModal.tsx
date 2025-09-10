import React, { memo, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Text,
  SegmentedButtons,
  Portal,
  Modal,
  Divider,
} from "react-native-paper";
import { FilterOptions } from "../../types/transaction";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../../constants/categories";
import { TransactionType } from "../../constants/enums";
import CustomTextInput from "../../components/atoms/CustomTextInput";
import CustomButton from "../../components/atoms/CustomButton";
import CustomDropdown from "../../components/atoms/CustomDropdown";
import { useAppSelector } from "../../store";
import { selectTheme } from "../../store/slices/themeSlice";

interface FilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  onApply: (filters: FilterOptions) => void;
  onClear: () => void;
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = memo(
  ({ visible, onDismiss, onApply, onClear, currentFilters }) => {
    const theme = useAppSelector(selectTheme);

    const [filters, setFilters] = useState<FilterOptions>(currentFilters);

    const typeOptions = [
      { value: TransactionType.INCOME, label: "Income" },
      { value: TransactionType.EXPENSE, label: "Expense" },
    ];

    const getAvailableCategories = () => {
      const currentType = filters.type || TransactionType.EXPENSE;
      if (currentType === TransactionType.INCOME) return INCOME_CATEGORIES;
      if (currentType === TransactionType.EXPENSE) return EXPENSE_CATEGORIES;
      return [];
    };

    const updateFilter = useCallback(
      (field: keyof FilterOptions, value: any) => {
        setFilters((prev) => ({
          ...prev,
          [field]: value,
          // Reset category when type changes
          ...(field === "type" && { category: undefined }),
        }));
      },
      []
    );

    const handleApply = useCallback(() => {
      const cleanFilters = Object.entries(filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== "") {
            acc[key as keyof FilterOptions] = value;
          }
          return acc;
        },
        {} as FilterOptions
      );

      onApply(cleanFilters);
      onDismiss();
    }, [filters, onApply, onDismiss]);

    const handleClear = useCallback(() => {
      setFilters({});
      onClear();
      onDismiss();
    }, [onClear, onDismiss]);

    const handleCancel = useCallback(() => {
      setFilters(currentFilters);
      onDismiss();
    }, [currentFilters, onDismiss]);

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCancel}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={styles.card}>
              <Card.Content style={styles.content}>
                <Text variant="headlineSmall" style={styles.title}>
                  Filter Transactions
                </Text>

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Transaction Type
                  </Text>
                  <SegmentedButtons
                    value={filters.type || TransactionType.EXPENSE}
                    onValueChange={(value) =>
                      updateFilter("type", value as TransactionType)
                    }
                    buttons={typeOptions}
                    style={styles.segmentedButtons}
                  />
                </View>

                <Divider style={styles.divider} />

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Amount Range
                  </Text>
                  <View style={styles.amountRow}>
                    <CustomTextInput
                      label="Min Amount"
                      value={filters.minAmount?.toString() || ""}
                      onChangeText={(text) =>
                        updateFilter(
                          "minAmount",
                          text ? Number(text) : undefined
                        )
                      }
                      keyboardType="numeric"
                      style={styles.amountInput}
                    />
                    <CustomTextInput
                      label="Max Amount"
                      value={filters.maxAmount?.toString() || ""}
                      onChangeText={(text) =>
                        updateFilter(
                          "maxAmount",
                          text ? Number(text) : undefined
                        )
                      }
                      keyboardType="numeric"
                      style={styles.amountInput}
                    />
                  </View>
                </View>

                {(filters.type || TransactionType.EXPENSE) && (
                  <Divider style={styles.divider} />
                )}

                {(filters.type || TransactionType.EXPENSE) && (
                  <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                      Category
                    </Text>
                    <CustomDropdown
                      value={filters.category}
                      placeholder="Select Category"
                      options={getAvailableCategories()}
                      onSelect={(category) =>
                        updateFilter("category", category)
                      }
                      style={styles.categoryButton}
                    />
                  </View>
                )}

                <View style={styles.actions}>
                  <CustomButton
                    title="Clear"
                    variant="outlined"
                    onPress={handleClear}
                    style={styles.actionButton}
                  />
                  <CustomButton
                    title="Cancel"
                    variant="outlined"
                    onPress={handleCancel}
                    style={styles.actionButton}
                  />
                  <CustomButton
                    title="Apply"
                    onPress={handleApply}
                    style={styles.actionButton}
                  />
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </Modal>
      </Portal>
    );
  }
);

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    maxHeight: "90%",
  },
  card: {
    borderRadius: 12,
  },
  content: {
    padding: 24,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
  },
  amountInput: {
    flex: 1,
  },
  categoryButton: {
    marginTop: 8,
    justifyContent: "flex-start",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});

FilterModal.displayName = "FilterModal";

export default FilterModal;
