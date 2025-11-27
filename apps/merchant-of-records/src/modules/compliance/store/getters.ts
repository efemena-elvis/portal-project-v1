import { computed } from "vue";
import {
  complianceId,
  complianceBusiness,
  complianceRepresentative,
  complianceRegistration,
  complianceBankAccount,
  complianceSignatory,
  complianceAgreement,
  merchantData,
} from "./state";

import { IMerchantBaseType } from "@packages/models";
import { getDeepValue } from "./merchant-helpers";

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

// GET MERCHANT DATA
export const merchantDataComputed = computed(() => merchantData.value);

export const getMerchantData = <R = any>(
  merchantId: string,
  path: string
): R | undefined => {
  const merchant = merchantDataComputed.value.find(
    (item) => item.id === merchantId
  );

  if (!merchant) return undefined;

  return getDeepValue<IMerchantBaseType, R>(merchant, path);
};

