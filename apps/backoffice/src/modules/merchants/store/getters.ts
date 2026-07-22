import { computed } from "vue";
import { merchantList, merchantDetail } from "./state";

export const getAllMerchants = computed(() => merchantList.value);
export const getCurrentMerchant = computed(() => merchantDetail.value);
