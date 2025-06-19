import { computed } from "vue";
import { walletBalance, taxBalance } from "./state";

export const getAllWallets = computed(() => {
  return { walletBalance: walletBalance.value, taxBalance: taxBalance.value };
});
