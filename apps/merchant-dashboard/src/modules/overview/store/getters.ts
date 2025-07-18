import { computed } from "vue";
import { walletBalance } from "./state";

export const getAllWallets = computed(() => {
  return { walletBalance: walletBalance.value };
});
