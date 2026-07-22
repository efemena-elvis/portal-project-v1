import { computed } from "vue";
import { feeList, feeDetail } from "./state";

export const getAllFees = computed(() => feeList.value);
export const getCurrentFee = computed(() => feeDetail.value);
