import React, { memo } from "react";
import { Button, ButtonProps } from "react-native-paper";
import { StyleSheet } from "react-native";

interface CustomButtonProps extends Omit<ButtonProps, "children"> {
  title: string;
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
}

const CustomButton: React.FC<CustomButtonProps> = memo(
  ({ title, variant = "contained", size = "medium", style, ...props }) => {
    const buttonStyle = [
      styles.button,
      size === "small" && styles.smallButton,
      size === "large" && styles.largeButton,
      style,
    ];

    return (
      <Button
        mode={variant}
        style={buttonStyle}
        contentStyle={styles.content}
        labelStyle={[
          styles.label,
          size === "small" && styles.smallLabel,
          size === "large" && styles.largeLabel,
        ]}
        {...props}
      >
        {title}
      </Button>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  smallButton: {
    minWidth: 80,
  },
  largeButton: {
    minWidth: 200,
  },
  content: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  smallLabel: {
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 18,
  },
});

CustomButton.displayName = "CustomButton";

export default CustomButton;
