import { computed } from "vue";
import { fundingList, fundingDetail } from "./state";

export const getAllFunding = computed(() => fundingList.value);
export const getCurrentFunding = computed(() => fundingDetail.value);
