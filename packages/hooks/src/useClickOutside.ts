import { onMounted, onUnmounted, Ref } from "vue";

export default function useClickOutside(
  dialogRef: Ref<HTMLElement | null>,
  togglerRef: Ref<HTMLElement | null>,
  dialogHandler: (state: boolean) => void
) {
  const listener = (event: MouseEvent | TouchEvent) => {
    if (
      dialogRef.value &&
      !dialogRef.value.contains(event.target as Node) &&
      togglerRef.value &&
      !togglerRef.value.contains(event.target as Node)
    ) {
      dialogHandler(false);
    }
  };

  onMounted(() => {
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
  });

  onUnmounted(() => {
    document.removeEventListener("mousedown", listener);
    document.removeEventListener("touchstart", listener);
  });
}
