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

import { setDeepValue } from "./merchant-helpers";
import { IMerchantBaseType } from "@packages/models";

import { merchantDataComputed } from "./getters";

type MerchantUpdatePath =
  | "profile.legal_name"
  | "profile.sector"
  | "profile.email"
  | "profile.phone_number"
  | "profile.website"
  | "address.country"
  | "address.address"
  | "address.billing_descriptor1"
  | "address.billing_descriptor2"
  | "documents.tax_number"
  | "documents.business_certificate_url"
  | "documents.form_3_url"
  | "director1.full_name"
  | "director1.country"
  | "director1.address"
  | "director1.director_id_url"
  | "ubo1.full_name"
  | "ubo1.country"
  | "ubo1.address"
  | "ubo1.doc_id_url";

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

  const addMerchantData = () => {
    const newMerchantId = generateMerchantId();

    const newMerchant: IMerchantBaseType = {
      id: newMerchantId,
      profile: {
        legal_name: "",
        sector: "",
        email: "",
        phone_number: "",
        website: null,
      },
      address: {
        country: "",
        address: "",
        billing_descriptor1: "",
        billing_descriptor2: null,
      },
      director1: {
        full_name: "",
        country: "",
        address: "",
        director_id_url: "",
      },
      director2: {
        full_name: "",
        country: "",
        address: "",
        director_id_url: "",
      },
      ubo1: {
        full_name: "",
        country: "",
        address: "",
        doc_id_url: "",
      },
      ubo2: {
        full_name: "",
        country: "",
        address: "",
        doc_id_url: "",
      },
      documents: {
        tax_number: "",
        business_certificate_url: "",
        form_3_url: "",
      },
    };

    merchantData.value.push(newMerchant);
  };

  const removeMerchantData = (merchantId: string) => {
    const index = merchantDataComputed.value.findIndex(
      (m) => m.id === merchantId
    );
    if (index !== -1) {
      merchantData.value.splice(index, 1);
    }
  };

  return {
    mutateCompliance,
    updateMerchantData,
    addMerchantData,
    removeMerchantData,
  };
}
