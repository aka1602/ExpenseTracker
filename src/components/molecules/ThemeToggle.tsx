import React, { memo } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Menu, Text } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectTheme, selectThemeMode, setThemeMode, saveThemePreference } from "../../store/slices/themeSlice";
import { ThemeMode } from "../../constants/enums";

const ThemeToggle: React.FC = memo(() => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const themeMode = useAppSelector(selectThemeMode);
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleThemeChange = (mode: ThemeMode) => {
    dispatch(setThemeMode(mode));
    dispatch(saveThemePreference(mode));
    closeMenu();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case ThemeMode.LIGHT:
        return "weather-sunny";
      case ThemeMode.DARK:
        return "weather-night";
      case ThemeMode.SYSTEM:
        return "theme-light-dark";
      default:
        return "theme-light-dark";
    }
  };

  const themeOptions = [
    { mode: ThemeMode.LIGHT, label: "Light", icon: "weather-sunny" },
    { mode: ThemeMode.DARK, label: "Dark", icon: "weather-night" },
    { mode: ThemeMode.SYSTEM, label: "System", icon: "theme-light-dark" },
  ];

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <IconButton
            icon={getThemeIcon()}
            size={24}
            onPress={openMenu}
            iconColor={theme.colors.onSurface}
          />
        }
        contentStyle={[styles.menu, { backgroundColor: theme.colors.surface }]}
      >
        {themeOptions.map((option) => (
          <Menu.Item
            key={option.mode}
            onPress={() => handleThemeChange(option.mode)}
            title={option.label}
            leadingIcon={option.icon}
            titleStyle={[
              styles.menuItemTitle,
              themeMode === option.mode && {
                color: theme.colors.primary,
                fontWeight: "600",
              },
            ]}
          />
        ))}
      </Menu>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  menu: {
    borderRadius: 8,
    elevation: 4,
  },
  menuItemTitle: {
    fontSize: 16,
  },
});

ThemeToggle.displayName = "ThemeToggle";

export default ThemeToggle;
