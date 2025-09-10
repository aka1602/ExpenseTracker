import { ThemeMode } from '../constants/enums';

export interface AppTheme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    surface: string;
    accent: string;
    error: string;
    text: string;
    onSurface: string;
    disabled: string;
    placeholder: string;
    backdrop: string;
    notification: string;
    income: string;
    expense: string;
  };
}

export { ThemeMode };
