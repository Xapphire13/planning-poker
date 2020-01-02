export default {
  getItem<T>(key: string): T | undefined {
    const itemJson = localStorage.getItem(key);
    return itemJson && JSON.parse(itemJson);
  },

  setItem<T>(key: string, item: T): void {
    localStorage.setItem(key, JSON.stringify(item));
  },
};
