import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => Promise<void>, () => Promise<void>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial value from storage
  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          const parsedValue = JSON.parse(item);
          setStoredValue(parsedValue);
        }
      } catch (error) {
        console.error(`Error loading ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredValue();
  }, [key]);

  // Save value to storage
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
        throw error;
      }
    },
    [key, storedValue]
  );

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export function useAsyncStorage() {
  const getAllKeys = useCallback(async (): Promise<string[]> => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error("Error getting all keys:", error);
      return [];
    }
  }, []);

  const multiGet = useCallback(async (keys: string[]): Promise<Record<string, any>> => {
    try {
      const result = await AsyncStorage.multiGet(keys);
      return result.reduce((acc, [key, value]) => {
        if (value !== null) {
          try {
            acc[key] = JSON.parse(value);
          } catch {
            acc[key] = value;
          }
        }
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error("Error in multiGet:", error);
      return {};
    }
  }, []);

  const multiSet = useCallback(async (keyValuePairs: [string, any][]): Promise<void> => {
    try {
      const serializedPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(serializedPairs);
    } catch (error) {
      console.error("Error in multiSet:", error);
      throw error;
    }
  }, []);

  const clear = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  }, []);

  const getStorageSize = useCallback(async (): Promise<number> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      return values.reduce((size, [, value]) => {
        return size + (value ? value.length : 0);
      }, 0);
    } catch (error) {
      console.error("Error calculating storage size:", error);
      return 0;
    }
  }, []);

  return {
    getAllKeys,
    multiGet,
    multiSet,
    clear,
    getStorageSize,
  };
}
