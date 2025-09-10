import React, { memo, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Card,
  Text,
  SegmentedButtons,
  Portal,
  Modal,
} from "react-native-paper";
import { TransactionFormData } from "../../types/transaction";
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

interface TransactionFormProps {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: Partial<TransactionFormData>;
  title?: string;
}

const TransactionForm: React.FC<TransactionFormProps> = memo(
  ({
    visible,
    onDismiss,
    onSubmit,
    initialData,
    title = "Add Transaction",
  }) => {
    const theme = useAppSelector(selectTheme);

    const [formData, setFormData] = useState<TransactionFormData>({
      amount: initialData?.amount || "",
      category: initialData?.category || "",
      type: initialData?.type || TransactionType.EXPENSE,
      description: initialData?.description || "",
    });

    const [errors, setErrors] = useState<
      Partial<Record<keyof TransactionFormData, string>>
    >({});

    const categories =
      formData.type === TransactionType.EXPENSE
        ? EXPENSE_CATEGORIES
        : INCOME_CATEGORIES;

    const validateForm = useCallback((): boolean => {
      const newErrors: Partial<Record<keyof TransactionFormData, string>> = {};

      if (
        !formData.amount ||
        isNaN(Number(formData.amount)) ||
        Number(formData.amount) <= 0
      ) {
        newErrors.amount = "Please enter a valid amount greater than 0";
      }

      if (!formData.category) {
        newErrors.category = "Please select a category";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(() => {
      if (validateForm()) {
        onSubmit(formData);
        handleReset();
      }
    }, [formData, validateForm, onSubmit]);

    const handleReset = useCallback(() => {
      setFormData({
        amount: "",
        category: "",
        type: "expense",
        description: "",
      });
      setErrors({});
      setShowCategoryMenu(false);
    }, []);

    const handleDismiss = useCallback(() => {
      handleReset();
      onDismiss();
    }, [handleReset, onDismiss]);

    const updateFormData = useCallback(
      (field: keyof TransactionFormData, value: string | TransactionType) => {
        setFormData((prev) => ({
          ...prev,
          [field]: value,
          // Reset category when type changes
          ...(field === "type" && { category: "" }),
        }));

        // Clear error for this field
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
      [errors]
    );

    const typeOptions = [
      { value: TransactionType.EXPENSE, label: "Expense" },
      { value: TransactionType.INCOME, label: "Income" },
    ];

    return (
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleDismiss}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Card style={styles.card}>
              <Card.Content style={styles.content}>
                <Text variant="headlineSmall" style={styles.title}>
                  {title}
                </Text>

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Type
                  </Text>
                  <SegmentedButtons
                    value={formData.type}
                    onValueChange={(value) =>
                      updateFormData("type", value as TransactionType)
                    }
                    buttons={typeOptions}
                    style={styles.segmentedButtons}
                  />
                </View>

                <View style={styles.section}>
                  <CustomTextInput
                    label="Amount (₹)"
                    value={formData.amount}
                    onChangeText={(text) => updateFormData("amount", text)}
                    keyboardType="numeric"
                    error={errors.amount}
                    left={<CustomTextInput.Icon icon="currency-inr" />}
                  />
                </View>

                <View style={styles.section}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Category
                  </Text>
                  {errors.category && (
                    <Text
                      variant="bodySmall"
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {errors.category}
                    </Text>
                  )}
                  <CustomDropdown
                    value={formData.category}
                    placeholder="Select Category"
                    options={categories}
                    onSelect={(category) =>
                      updateFormData("category", category)
                    }
                    style={styles.categoryButton}
                  />
                </View>

                <View style={styles.section}>
                  <CustomTextInput
                    label="Description (Optional)"
                    value={formData.description}
                    onChangeText={(text) => updateFormData("description", text)}
                    multiline
                    numberOfLines={3}
                    error={errors.description}
                  />
                </View>

                <View style={styles.actions}>
                  <CustomButton
                    title="Cancel"
                    variant="outlined"
                    onPress={handleDismiss}
                    style={styles.cancelButton}
                  />
                  <CustomButton
                    title="Save"
                    onPress={handleSubmit}
                    style={styles.saveButton}
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
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  categoryButton: {
    marginTop: 8,
    justifyContent: "flex-start",
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

TransactionForm.displayName = "TransactionForm";

export default TransactionForm;
