export interface ComplianceBusiness {
  uuid: string;
  name: string;
  country_id: number;
  country_code: string;
  trading_name: string;
  operation: string;
  category: string;
  phone_number: string;
  website: string;
  address: string;
  city: string;
  state: string;
  tax_ref: string;
  status: string;
  kyc_completed: boolean;
}

export interface ComplianceDocument {
  uuid: string;
  business_uuid: string;
  business_name: string;
  document_id: number;
  document_name: string;
  document_type: "file" | "text";
  file_url: string;
  file_name: string;
  value: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceMerchant {
  merchant_id: string;
  merchant_email: string;
  merchant_name: string;
  business: ComplianceBusiness;
  documents: ComplianceDocument[];
}

export interface ComplianceResponseData {
  page: number;
  page_size: number;
  total_records: number;
  merchants: ComplianceMerchant[];
}
