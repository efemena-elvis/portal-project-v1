import { computed } from "vue";
import { transactionList, transactionDetail } from "./state";

export const getAllTransactions = computed(() => transactionList.value);
export const getCurrentTransaction = computed(() => transactionDetail.value);
