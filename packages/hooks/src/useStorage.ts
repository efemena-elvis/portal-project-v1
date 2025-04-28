export default function useStorage() {
  const getStorage = ({
    storage_name,
    storage_type = "string",
  }: {
    storage_name: string;
    storage_type?: "string" | "object";
  }): string | object | null => {
    const stored_data = localStorage.getItem(storage_name);
    return storage_type === "string"
      ? stored_data
      : stored_data
        ? JSON.parse(stored_data)
        : null;
  };

  const setStorage = ({
    storage_name,
    storage_value,
    storage_type = "string",
  }: {
    storage_name: string;
    storage_value: string | number | object;
    storage_type?: "string" | "object";
  }): void => {
    if (storage_type === "string") {
      localStorage.setItem(storage_name, storage_value as string);
    } else {
      localStorage.setItem(storage_name, JSON.stringify(storage_value));
    }
  };

  const removeStorage = (storage_name: string): void => {
    localStorage.removeItem(storage_name);
  };

  return {
    getStorage,
    setStorage,
    removeStorage,
  };
}
