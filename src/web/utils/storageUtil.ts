function wrapStorage(storage: Storage | undefined) {
  return {
    getItem<T = string>(key: string): T | undefined {
      const itemJson = storage?.getItem(key);
      return itemJson && JSON.parse(itemJson);
    },

    setItem<T>(key: string, item: T): void {
      storage?.setItem(key, JSON.stringify(item));
    }
  };
}

export default {
  local: wrapStorage(
    typeof localStorage !== 'undefined' ? localStorage : undefined
  ),
  session: wrapStorage(
    typeof sessionStorage !== 'undefined' ? sessionStorage : undefined
  )
};
