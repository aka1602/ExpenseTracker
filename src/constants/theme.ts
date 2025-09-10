import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";
import { AppTheme } from "../types/theme";

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    income: "#2ECC71",
    expense: "#E74C3C",
  },
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    income: "#27AE60",
    expense: "#C0392B",
  },
};
