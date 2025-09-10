import React, { memo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Button,
  Portal,
  Modal,
  Card,
  List,
  Divider,
  Text,
} from "react-native-paper";
import { useAppSelector } from "../../store";
import { selectTheme } from "../../store/slices/themeSlice";

interface CustomDropdownProps {
  value?: string;
  placeholder: string;
  options: string[];
  onSelect: (value: string) => void;
  style?: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = memo(
  ({ value, placeholder, options, onSelect, style }) => {
    const theme = useAppSelector(selectTheme);
    const [visible, setVisible] = useState(false);

    const handleSelect = (selectedValue: string) => {
      onSelect(selectedValue);
      setVisible(false);
    };

    return (
      <>
        <Button
          mode="outlined"
          onPress={() => setVisible(true)}
          style={[styles.button, style]}
          contentStyle={styles.buttonContent}
          icon="chevron-down"
        >
          {value || placeholder}
        </Button>

        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            contentContainerStyle={[
              styles.modal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.content}>
                <Text variant="titleMedium" style={styles.title}>
                  {placeholder}
                </Text>
                <Divider style={styles.divider} />
                <ScrollView
                  style={styles.scrollView}
                  showsVerticalScrollIndicator={true}
                >
                  {options.map((option, index) => (
                    <List.Item
                      key={option}
                      title={option}
                      onPress={() => handleSelect(option)}
                      style={[
                        styles.listItem,
                        value === option && {
                          backgroundColor: theme.colors.primaryContainer,
                        },
                      ]}
                      titleStyle={
                        value === option
                          ? { color: theme.colors.primary, fontWeight: "600" }
                          : undefined
                      }
                      right={() =>
                        value === option ? (
                          <List.Icon
                            icon="check"
                            color={theme.colors.primary}
                          />
                        ) : null
                      }
                    />
                  ))}
                </ScrollView>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>
      </>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    justifyContent: "flex-start",
  },
  buttonContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  modal: {
    margin: 20,
    maxHeight: "70%",
  },
  card: {
    borderRadius: 12,
  },
  content: {
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  divider: {
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 300,
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 2,
  },
});

CustomDropdown.displayName = "CustomDropdown";

export default CustomDropdown;
