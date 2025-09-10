import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import { useColorScheme } from "react-native";
import { store, useAppDispatch, useAppSelector } from "./src/store";
import { selectTheme } from "./src/store/slices/themeSlice";
import {
  setSystemColorScheme,
  loadThemePreference,
} from "./src/store/slices/themeSlice";
import { loadTransactions } from "./src/store/slices/transactionSlice";
import HomeScreen from "./src/screens/HomeScreen";

function AppContent() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const systemColorScheme = useColorScheme();

  useEffect(() => {
    dispatch(loadThemePreference());
    dispatch(loadTransactions());
  }, [dispatch]);
  useEffect(() => {
    if (systemColorScheme) {
      dispatch(setSystemColorScheme(systemColorScheme));
    }
  }, [systemColorScheme, dispatch]);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <HomeScreen />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
