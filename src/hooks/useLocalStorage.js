import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep in sync
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };
  
  const [storedValue, setStoredValue] = useState(readValue);
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };
  
  // Sync between tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          const newValue = JSON.parse(e.newValue);
          if (newValue !== storedValue) {
            setStoredValue(newValue);
          }
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, storedValue]);
  
  return [storedValue, setValue];
};

// Hook for boolean values
export const useLocalStorageBoolean = (key, initialValue = false) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  return [value, setValue];
};

// Hook for string values
export const useLocalStorageString = (key, initialValue = '') => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  return [value, setValue];
};

// Hook for number values
export const useLocalStorageNumber = (key, initialValue = 0) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  return [value, setValue];
};

// Hook for array values
export const useLocalStorageArray = (key, initialValue = []) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  return [value, setValue];
};

// Hook for object values
export const useLocalStorageObject = (key, initialValue = {}) => {
  const [value, setValue] = useLocalStorage(key, initialValue);
  return [value, setValue];
};