export const localStorageClient = {
  get<T>(key: string): T | null {
    try {
      const rawValue = window.localStorage.getItem(key);
      return rawValue ? (JSON.parse(rawValue) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  },

  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  },
};
