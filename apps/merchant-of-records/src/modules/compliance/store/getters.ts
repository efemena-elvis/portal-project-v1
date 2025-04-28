import { computed } from "vue";
import {
  complianceId,
  complianceBusiness,
  complianceRepresentative,
  complianceRegistration,
  complianceBankAccount,
  complianceSignatory,
  complianceAgreement,
} from "./state";

export const getComplianceId = computed(() => complianceId.value);
export const getComplianceBusiness = computed(() => complianceBusiness.value);
export const getComplianceRegistration = computed(
  () => complianceRegistration.value
);
export const getComplianceRepresentative = computed(
  () => complianceRepresentative.value
);
export const getComplianceBankAccount = computed(
  () => complianceBankAccount.value
);
export const getComplianceBusinessSignatory = computed(
  () => complianceSignatory.value
);
export const getComplianceAgreement = computed(() => complianceAgreement.value);
