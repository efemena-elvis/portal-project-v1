import { onMounted, onUnmounted } from "vue";

export function usePolling(fetchFn: () => void, intervalMs = 60000) {
  let timer: ReturnType<typeof setInterval> | null = null;
  let inFlight = false;

  const run = () => {
    if (document.hidden || inFlight) return;
    inFlight = true;
    Promise.resolve(fetchFn()).finally(() => {
      inFlight = false;
    });
  };

  const start = () => {
    stop();
    timer = setInterval(run, intervalMs);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  onMounted(start);
  onUnmounted(stop);
}
