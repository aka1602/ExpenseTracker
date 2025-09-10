import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppTheme, ThemeMode } from '../../types/theme';
import { StorageKeys } from '../../constants/enums';
import { lightTheme, darkTheme } from '../../constants/theme';

interface ThemeState {
  theme: AppTheme;
  themeMode: ThemeMode;
  systemColorScheme: 'light' | 'dark' | null;
}

const initialState: ThemeState = {
  theme: lightTheme,
  themeMode: ThemeMode.SYSTEM,
  systemColorScheme: null,
};

// Async thunks
export const loadThemePreference = createAsyncThunk(
  'theme/loadThemePreference',
  async (_, { rejectWithValue }) => {
    try {
      const savedTheme = await AsyncStorage.getItem(StorageKeys.THEME);
      if (savedTheme && Object.values(ThemeMode).includes(savedTheme as ThemeMode)) {
        return savedTheme as ThemeMode;
      }
      return ThemeMode.SYSTEM;
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      return rejectWithValue('Failed to load theme preference');
    }
  }
);

export const saveThemePreference = createAsyncThunk(
  'theme/saveThemePreference',
  async (mode: ThemeMode, { rejectWithValue }) => {
    try {
      await AsyncStorage.setItem(StorageKeys.THEME, mode);
      return mode;
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      return rejectWithValue('Failed to save theme preference');
    }
  }
);

const getEffectiveTheme = (mode: ThemeMode, systemColorScheme: 'light' | 'dark' | null): AppTheme => {
  switch (mode) {
    case ThemeMode.LIGHT:
      return lightTheme;
    case ThemeMode.DARK:
      return darkTheme;
    case ThemeMode.SYSTEM:
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    default:
      return lightTheme;
  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setSystemColorScheme: (state, action: PayloadAction<'light' | 'dark' | null>) => {
      state.systemColorScheme = action.payload;
      state.theme = getEffectiveTheme(state.themeMode, action.payload);
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      state.theme = getEffectiveTheme(action.payload, state.systemColorScheme);
    },
    toggleTheme: (state) => {
      const newMode = state.themeMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT;
      state.themeMode = newMode;
      state.theme = getEffectiveTheme(newMode, state.systemColorScheme);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemePreference.fulfilled, (state, action) => {
        state.themeMode = action.payload;
        state.theme = getEffectiveTheme(action.payload, state.systemColorScheme);
      })
      .addCase(saveThemePreference.fulfilled, (state, action) => {
        state.themeMode = action.payload;
        state.theme = getEffectiveTheme(action.payload, state.systemColorScheme);
      });
  },
});

export const { setSystemColorScheme, setThemeMode, toggleTheme } = themeSlice.actions;

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme.theme;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.themeMode;

export default themeSlice.reducer;
