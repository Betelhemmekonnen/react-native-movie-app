import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Thin wrapper around AsyncStorage for consistent error handling and type safety
 */
export class StorageService {
  /**
   * Store data with a key
   * @param key - Storage key
   * @param value - Data to store (will be JSON stringified)
   * @returns Promise<boolean> - Success status
   */
  static async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`StorageService.setItem error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Retrieve data by key
   * @param key - Storage key
   * @returns Promise<T | null> - Parsed data or null if not found/error
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`StorageService.getItem error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Remove data by key
   * @param key - Storage key
   * @returns Promise<boolean> - Success status
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`StorageService.removeItem error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Check if a key exists
   * @param key - Storage key
   * @returns Promise<boolean> - Whether key exists
   */
  static async hasItem(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error(`StorageService.hasItem error for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get all keys
   * @returns Promise<string[]> - Array of all storage keys
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys || []);
    } catch (error) {
      console.error('StorageService.getAllKeys error:', error);
      return [];
    }
  }

  /**
   * Clear all data
   * @returns Promise<boolean> - Success status
   */
  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('StorageService.clear error:', error);
      return false;
    }
  }

  /**
   * Get multiple items by keys
   * @param keys - Array of storage keys
   * @returns Promise<Record<string, T | null>> - Object with key-value pairs
   */
  static async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      
      values.forEach(([key, value]) => {
        result[key] = value ? JSON.parse(value) : null;
      });
      
      return result;
    } catch (error) {
      console.error('StorageService.getMultiple error:', error);
      return {};
    }
  }

  /**
   * Set multiple items
   * @param keyValuePairs - Array of [key, value] pairs
   * @returns Promise<boolean> - Success status
   */
  static async setMultiple<T>(keyValuePairs: [string, T][]): Promise<boolean> {
    try {
      const pairs: [string, string][] = keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
      await AsyncStorage.multiSet(pairs);
      return true;
    } catch (error) {
      console.error('StorageService.setMultiple error:', error);
      return false;
    }
  }
}
