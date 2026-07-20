import { watch, onMounted, type ComputedRef } from "vue";

export function useAutoFetch(
  filters: ComputedRef<string>,
  fetchFn: (filters: string) => void,
) {
  watch(filters, (newFilters) => fetchFn(newFilters));
  onMounted(() => fetchFn(filters.value));
}
