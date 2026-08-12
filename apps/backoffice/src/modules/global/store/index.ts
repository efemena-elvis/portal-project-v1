import { defineStore } from "pinia";
import { ref } from "vue";
import { useGlobalActions } from "./actions";

export const useGlobalStore = defineStore("global", () => {
  const actions = useGlobalActions();

  const environment = ref<string>("live")

  return {
    ...actions,
    environment,
    updateEnvironment: (mode: string) => {
      environment.value = mode
    }
  };
});
