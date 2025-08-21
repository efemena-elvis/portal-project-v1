import {
  complianceId,
  complianceBusiness,
  complianceRegistration,
  complianceRepresentative,
  complianceBankAccount,
  complianceSignatory,
  complianceAgreement,
} from "./state";

import {
  complianceBase,
  IComplianceBusiness,
  IComplianceRegistration,
  IComplianceRepresentative,
  IComplianceBankAccount,
  IComplianceSignatory,
  IComplianceTerms,
} from "./compliance-base";

export function useComplianceMutations() {
  const mutateCompliance = (response: any) => {
    const responsePayload =
      response.code === 200 ? response.data : complianceBase;

    mutateComplianceId(responsePayload?.id);
    mutateComplianceBusiness(responsePayload?.business);
    mutateComplianceRegistration(responsePayload?.registration);
    mutateComplianceRepresentative(responsePayload?.representatives);
    mutateComplianceBankAccount(responsePayload?.bank_account);
    mutateComplianceSignatory(responsePayload?.business_signatory);
    mutateComplianceAgreement(responsePayload?.terms);
  };

  const mutateComplianceId = (payload: string) => {
    complianceId.value = payload;
  };

  const mutateComplianceBusiness = (payload: IComplianceBusiness) => {
    complianceBusiness.value = payload;
  };

  const mutateComplianceRegistration = (payload: IComplianceRegistration) => {
    complianceRegistration.value = payload;
  };

  const mutateComplianceRepresentative = (
    payload: IComplianceRepresentative[]
  ) => {
    complianceRepresentative.value = payload;
  };

  const mutateComplianceBankAccount = (payload: IComplianceBankAccount) => {
    complianceBankAccount.value = payload;
  };

  const mutateComplianceSignatory = (payload: IComplianceSignatory) => {
    complianceSignatory.value = payload;
  };

  const mutateComplianceAgreement = (payload: IComplianceTerms) => {
    complianceAgreement.value = payload;
  };

  return {
    mutateCompliance,
  };
}
