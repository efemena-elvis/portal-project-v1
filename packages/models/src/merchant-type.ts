// Interface for Bulk Upload Table
export interface BulkUploadTableType {
  name: string;
  label: string;
  type: string;
  path: string;
  placeholder?: string;
  options?: { value: string; name: string }[];
  readonly?: boolean;
}

export interface IMerchantProfile {
  legal_name: string;
  sector: string;
  email: string;
  phone_number: string;
  website?: string | null;
}

export interface IMerchantAddress {
  country: string;
  address: string;
  billing_descriptor1: string;
  billing_descriptor2?: string | null;
}

export interface IMerchantDirector {
  full_name: string;
  country: string;
  address: string;
  director_id_url: string;
}

export interface IMerchantUBO {
  full_name: string;
  country: string;
  address: string;
  doc_id_url: string;
}

export interface IMerchantDocuments {
  tax_number: string;
  business_certificate_url: string;
  form_3_url: string;
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
