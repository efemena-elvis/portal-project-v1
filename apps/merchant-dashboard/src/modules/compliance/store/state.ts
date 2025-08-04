import { ref } from "vue";
import {
  IComplianceBusiness,
  IComplianceRegistration,
  IComplianceRepresentative,
  IComplianceBankAccount,
  IComplianceSignatory,
  IComplianceTerms,
} from "./compliance-base";

export const complianceId = ref<string>("");
export const complianceBusiness = ref<IComplianceBusiness>();
export const complianceRegistration = ref<IComplianceRegistration>();
export const complianceRepresentative = ref<IComplianceRepresentative[]>();
export const complianceBankAccount = ref<IComplianceBankAccount>();
export const complianceSignatory = ref<IComplianceSignatory>();
export const complianceAgreement = ref<IComplianceTerms>();
