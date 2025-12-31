export const saveLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("localStorage 저장 실패:", error);
  }
};

export const loadLocalStorage = <T>(key: string): T | null => {
  try {
    const value = localStorage.getItem(key);
    if (!value) return null;

    return JSON.parse(value);
  } catch (error) {
    console.error("localStorage 불러오기 실패:", error);
    return null;
  }
};
