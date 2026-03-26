import { useEffect, useCallback, useRef } from "react";

const STORAGE_VERSION = "1.0";

interface StorageData<T> {
  version: string;
  timestamp: number;
  data: T;
}

/**
 * Custom hook for persisting form data to localStorage with auto-save and restoration
 * @param key - Local storage key
 * @param data - Form data to persist
 * @param debounceMs - Debounce delay for auto-save (default: 1000ms)
 * @returns Object with restore and clear functions
 */
export function useFormPersistence<T>(
  key: string,
  data: T,
  debounceMs: number = 1000,
  enabled: boolean = true,
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save data to localStorage with debouncing
  const saveToStorage = useCallback(() => {
    try {
      const storageData: StorageData<T> = {
        version: STORAGE_VERSION,
        timestamp: new Date().getTime(),
        data,
      };
      localStorage.setItem(key, JSON.stringify(storageData));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      // Handle quota exceeded or other errors silently
    }
  }, [key, data]);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToStorage();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, saveToStorage, enabled]);

  // Load data from localStorage
  const loadFromStorage = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const parsed: StorageData<T> = JSON.parse(stored);

      // Version check for future compatibility
      if (parsed.version !== STORAGE_VERSION) {
        console.warn("Stored data version mismatch, clearing storage");
        localStorage.removeItem(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem(key);
      return null;
    }
  }, [key]);

  // Clear data from localStorage
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(key);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
  }, [key]);

  return {
    loadFromStorage,
    clearStorage,
  };
}
