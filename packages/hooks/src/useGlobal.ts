import { getCurrentInstance } from "vue";

export function useGlobalProperty<T = unknown>(key: string): T {
  const instance = getCurrentInstance();
  if (!instance) throw new Error("useGlobalProperty must be used inside setup");
  return instance.appContext.config.globalProperties[key] as T;
}

export function useAppVariant(): string {
  return useGlobalProperty<string>("$appVariant");
}
 