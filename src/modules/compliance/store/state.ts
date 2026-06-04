import { ref } from "vue";
import {
  IComplianceBusiness,
  IComplianceRegistration,
  IComplianceRepresentative,
  IComplianceBankAccount,
  IComplianceSignatory,
  IComplianceTerms,
  IComplianceFieldConfig,
} from "./compliance-base";
import { IMerchantBaseType } from "@packages/models";

export const complianceId = ref<string>("");
export const complianceBusiness = ref<IComplianceBusiness>();
export const complianceRegistration = ref<IComplianceRegistration>();
export const complianceRepresentative = ref<IComplianceRepresentative[]>();
export const complianceBankAccount = ref<IComplianceBankAccount>();
export const complianceSignatory = ref<IComplianceSignatory>();
export const complianceAgreement = ref<IComplianceTerms>();
export const complianceFields = ref<IComplianceFieldConfig[]>([]);

export const merchantData = ref<IMerchantBaseType[]>([
  {
    id: "_initial_mid_3540",

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

    documents: {
      tin_number: "",
      certificate_url: "",
      form3_url: "",
    },

    director1: {
      client_id: "",
      legal_full_name: "",
      country_id: "",
      address: "",
      doc_url: "",
      doc_type: "",
    },

    director2: {
      client_id: "",
      legal_full_name: "",
      country_id: "",
      address: "",
      doc_url: "",
      doc_type: "",
    },

    ubo1: {
      client_id: "",
      legal_full_name: "",
      country_id: "",
      address: "",
      doc_url: "",
      doc_type: "",
    },

    ubo2: {
      client_id: "",
      legal_full_name: "",
      country_id: "",
      address: "",
      doc_url: "",
      doc_type: "",
    },
  },
]);
