// Interface for Bulk Upload Table
export interface BulkUploadTableType {
  name: string;
  label: string;
  type: string;
  path: string;
  placeholder?: string;
  options?: { value: string; name: string }[];
  readonly?: boolean;
  validator?: (input: string | number, message?: string) => string;
}

export interface IMerchantProfile {
  legal_name: string;
  mcc: string;
  email: string;
  phone_number: string;
  website_link?: string | null;
}

export interface IMerchantAddress {
  country_id: string;
  address: string;
  billing_descriptor1: string;
  billing_descriptor2?: string | null;
}

export interface IMerchantDocuments {
  tin_number: string;
  certificate_url: string;
  form3_url: string;
}

export interface IMerchantDirector {
  legal_full_name: string;
  country_id: string;
  address: string;
  doc_type: string;
  doc_url: string;
}

export interface IMerchantUBO {
  legal_full_name: string;
  country_id: string;
  address: string;
  doc_type: string;
  doc_url: string;
}

export interface IMerchantBaseType {
  id: string;
  profile: IMerchantProfile;
  address: IMerchantAddress;
  director1: IMerchantDirector;
  director2: IMerchantDirector;
  ubo1: IMerchantUBO;
  ubo2: IMerchantUBO;
  documents: IMerchantDocuments;
}

export interface CleanedMerchantType {
  business: {
    legal_name: string;
    trading_name: string;
    mcc: string;
    email: string;
    phone_number: string;
    website_link: string | null;
    address: string;
    country_id: string;
    certificate_url: string;
    form3_url: string;
    tin_number: string;
    billing_descriptor1: string;
    billing_descriptor2: string | null;
    optional_doc_url: string;
  };
  representative: Array<{
    legal_full_name: string;
    address: string;
    country_id: string;
    business_role: string[];
    doc: {
      type: string;
      url: string;
    };
  }>;
  terms: {
    signed_agreement: boolean;
  };
}
