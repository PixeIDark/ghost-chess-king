export const saveLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("LocalStorage save failed:", error);
  }
};

export const loadLocalStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value);
  } catch (error) {
    console.error("LocalStorage load failed:", error);
    return null;
  }
};
