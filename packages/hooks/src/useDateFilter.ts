import { ref } from "vue";

export function useDateFilter() {
  const activePeriod = ref<[Date, Date] | null>(null);

  const onDateSelected = (
    selectedRange: [Date | string, Date | string] | null,
  ) => {
    if (selectedRange && selectedRange.length === 2) {
      activePeriod.value = [
        new Date(selectedRange[0]),
        new Date(selectedRange[1]),
      ];
    } else {
      activePeriod.value = null;
    }
  };

  return { activePeriod, onDateSelected };
}
