export interface IComplianceBusiness {
  legal_name: string;
  trading_name: string;
  sector: string;
  email: string;
  phone_number: string;
  website?: string | null;
  first_address?: string;
  city?: string;
  state?: string;
  doc_type: string;
  doc_url: string;
}

export interface IComplianceRegistration {
  doc_url: string;
  tax_doc_url: string;
  form_a_doc_url?: string;
}

export interface IComplianceRepresentative {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  business_role: string[];
  percentage_ownership?: string | null;
  doc: {
    type: string;
    value: string;
    url: string;
  };
}

export interface IComplianceBankAccount {
  // Required fields for all account types
  currency: string;
  account_holder_name: string;
  account_number: string;

  // Common optional fields
  bank_name?: string;
  bank_code?: string;
  bank_address?: string;

  // Region-specific optional fields
  iban?: string;
  swift_bic?: string;
  sort_code?: string;
  mobile_money_number?: string;
  routing_number?: string;
  account_type?: string;
  recipient_address?: string;
  transit_number?: string;
  institution_number?: string;
  cpf_cnpj?: string;
  branch_code?: string;
  clabe?: string;
  cbu?: string;
  cuil?: string;

  // Legacy field (consider deprecating)
  code?: string; // Possibly replaced by more specific codes
}

export interface IComplianceSignatory {
  legal_first_name: string;
  legal_last_name: string;
  dob: string;
  nationality: string;
  doc: {
    type: string;
    value: string;
    url: string;
  };
}

export interface IComplianceTerms {
  signed_agreement: boolean;
}

interface IComplianceBaseType {
  id: string;
  business: IComplianceBusiness;
  registration: IComplianceRegistration;
  representatives: IComplianceRepresentative[];
  bank_account: IComplianceBankAccount;
  business_signatory: IComplianceSignatory;
  terms: IComplianceTerms;
}

export const complianceBase: IComplianceBaseType = {
  id: "",

  business: {
    legal_name: "",
    trading_name: "",
    sector: "",
    email: "",
    phone_number: "",
    website: "",
    first_address: "",
    city: "",
    state: "",
    doc_type: "",
    doc_url: "",
  },

  registration: {
    doc_url: "",
    tax_doc_url: "",
    form_a_doc_url: "",
  },

  representatives: [
    {
      legal_first_name: "",
      legal_last_name: "",
      dob: "",
      nationality: "",
      business_role: [],
      percentage_ownership: "",
      doc: {
        type: "",
        value: "",
        url: "",
      },
    },
  ],

  bank_account: {
    currency: "",
    account_holder_name: "",
    account_number: "",
    code: "",
    bank_name: "",
    bank_code: "",
    bank_address: "",
    iban: "",
    swift_bic: "",
    sort_code: "",
    mobile_money_number: "",
    routing_number: "",
    account_type: "",
    recipient_address: "",
    transit_number: "",
    institution_number: "",
    cpf_cnpj: "",
    branch_code: "",
    clabe: "",
    cbu: "",
    cuil: "",
  },

  business_signatory: {
    legal_first_name: "",
    legal_last_name: "",
    dob: "",
    nationality: "",
    doc: {
      type: "",
      value: "",
      url: "",
    },
  },

  terms: {
    signed_agreement: false,
  },
};
