import { ref } from "vue";
import {
  IComplianceBusiness,
  IComplianceRegistration,
  IComplianceRepresentative,
  IComplianceBankAccount,
  IComplianceSignatory,
  IComplianceTerms,
} from "./compliance-base";
import { IMerchantBaseType } from "@packages/models";

export const complianceId = ref<string>("");
export const complianceBusiness = ref<IComplianceBusiness>();
export const complianceRegistration = ref<IComplianceRegistration>();
export const complianceRepresentative = ref<IComplianceRepresentative[]>();
export const complianceBankAccount = ref<IComplianceBankAccount>();
export const complianceSignatory = ref<IComplianceSignatory>();
export const complianceAgreement = ref<IComplianceTerms>();

export const merchantData = ref<IMerchantBaseType[]>([
  {
    id: "_initial_mid_3540",

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

    documents: {
      tax_number: "",
      business_certificate_url: "",
      form_3_url: "",
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
  },
]);
