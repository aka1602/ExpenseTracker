import React, { memo, forwardRef } from "react";
import { TextInput, TextInputProps, HelperText } from "react-native-paper";
import { StyleSheet, View } from "react-native";

interface CustomTextInputProps extends Omit<TextInputProps, "theme"> {
  error?: string;
  helperText?: string;
}

const CustomTextInput = memo(
  forwardRef<any, CustomTextInputProps>(
    ({ error, helperText, style, ...props }, ref) => {
      return (
        <View style={styles.container}>
          <TextInput
            ref={ref}
            style={[styles.input, style]}
            error={!!error}
            {...props}
          />
          {(error || helperText) && (
            <HelperText
              type={error ? "error" : "info"}
              visible={!!(error || helperText)}
            >
              {error || helperText}
            </HelperText>
          )}
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: "transparent",
  },
});

CustomTextInput.displayName = "CustomTextInput";

// Attach Icon component for compatibility
CustomTextInput.Icon = TextInput.Icon;

export default CustomTextInput;
