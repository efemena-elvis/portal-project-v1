import {
  complianceId,
  complianceBusiness,
  complianceRegistration,
  complianceRepresentative,
  complianceBankAccount,
  complianceSignatory,
  complianceAgreement,
  merchantData,
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

import {
  setDeepValue,
  cleanMerchantData,
  transformCleanedToMerchantData,
} from "./merchant-helpers";
import { IMerchantBaseType, CleanedMerchantType } from "@packages/models";
import { merchantDataComputed } from "./getters";

type MerchantUpdatePath =
  | "profile.legal_name"
  | "profile.mcc"
  | "profile.email"
  | "profile.phone_number"
  | "profile.website_link"
  | "address.country_id"
  | "address.address"
  | "address.billing_descriptor1"
  | "address.billing_descriptor2"
  | "documents.tin_number"
  | "documents.certificate_url"
  | "documents.form3_url"
  | "director1.legal_full_name"
  | "director1.country_id"
  | "director1.address"
  | "director1.doc_type"
  | "director1.doc_url"
  | "director2.legal_full_name"
  | "director2.country_id"
  | "director2.address"
  | "director2.doc_type"
  | "director2.doc_url"
  | "ubo1.legal_full_name"
  | "ubo1.country_id"
  | "ubo1.address"
  | "ubo1.doc_type"
  | "ubo1.doc_url"
  | "ubo2.legal_full_name"
  | "ubo2.country_id"
  | "ubo2.address"
  | "ubo2.doc_type"
  | "ubo2.doc_url";

const generateMerchantId = (): string => {
  return `mid_${Math.random().toString(36).substr(2, 9)}`;
};

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

  // MERCHANT DATA MUTATIONS
  const updateMerchantData = ({
    id,
    path,
    value,
  }: {
    id: string;
    path: MerchantUpdatePath;
    value: any;
  }) => {
    const merchant = merchantDataComputed.value.find((item) => item.id === id);

    if (merchant) setDeepValue(merchant, path, value);
  };

  const addMerchantData = (isBlank: boolean = false) => {
    const newMerchantId = generateMerchantId();

    const newMerchant: IMerchantBaseType = {
      id: newMerchantId,
      profile: {
        legal_name: "",
        mcc: "",
        email: "",
        phone_number: "",
        website_link: "",
      },
      address: {
        country_id: "",
        address: "",
        billing_descriptor1: "",
        billing_descriptor2: "",
      },
      director1: {
        legal_full_name: "",
        country_id: "",
        address: "",
        doc_url: "",
        doc_type: "",
      },
      director2: {
        legal_full_name: "",
        country_id: "",
        address: "",
        doc_url: "",
        doc_type: "",
      },
      ubo1: {
        legal_full_name: "",
        country_id: "",
        address: "",
        doc_url: "",
        doc_type: "",
      },
      ubo2: {
        legal_full_name: "",
        country_id: "",
        address: "",
        doc_url: "",
        doc_type: "",
      },
      documents: {
        tin_number: "",
        certificate_url: "",
        form3_url: "",
      },
    };

    if (isBlank) merchantData.value = [newMerchant];
    else merchantData.value = [...merchantDataComputed.value, newMerchant];
  };

  const bulkUpdateMerchantData = (payload: IMerchantBaseType[]) => {
    merchantData.value = payload;
  };

  const removeMerchantData = (merchantId: string) => {
    const index = merchantDataComputed.value.findIndex(
      (m) => m.id === merchantId
    );
    if (index !== -1) {
      merchantData.value.splice(index, 1);
    }
  };

  const transformMerchantData = (
    merchantData: IMerchantBaseType[]
  ): CleanedMerchantType[] => {
    return cleanMerchantData(merchantData);
  };

  const transformCleanedMerchantData = (
    cleanedData: CleanedMerchantType[]
  ): IMerchantBaseType[] => {
    return transformCleanedToMerchantData(cleanedData);
  };

  return {
    mutateCompliance,
    updateMerchantData,
    addMerchantData,
    bulkUpdateMerchantData,
    removeMerchantData,
    transformMerchantData,
    transformCleanedMerchantData,
  };
}
