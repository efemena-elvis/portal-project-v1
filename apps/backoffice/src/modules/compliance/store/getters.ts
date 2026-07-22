import { computed } from "vue";
import { complianceData } from "./state";

export const getComplianceData = computed(() => complianceData.value);
