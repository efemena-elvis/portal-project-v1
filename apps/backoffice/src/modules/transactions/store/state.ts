import { ref } from "vue";

export const transactionList = ref<any[]>([]);
export const transactionDetail = ref<Record<string, any> | null>(null);
