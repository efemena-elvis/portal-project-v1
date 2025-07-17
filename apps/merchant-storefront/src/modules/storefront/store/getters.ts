// getters.ts
import { computed } from "vue";
import { activeStore } from "./state";

export const getActiveStore = computed(() => {return activeStore.value});
