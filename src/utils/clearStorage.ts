import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "../constants/enums";

export const clearAllStorageData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      StorageKeys.TRANSACTIONS,
      StorageKeys.THEME,
    ]);
    console.log("All storage data cleared successfully");
  } catch (error) {
    console.error("Failed to clear storage data:", error);
  }
};

export const clearTransactionsOnly = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(StorageKeys.TRANSACTIONS);
    console.log("Transaction data cleared successfully");
  } catch (error) {
    console.error("Failed to clear transaction data:", error);
  }
};
