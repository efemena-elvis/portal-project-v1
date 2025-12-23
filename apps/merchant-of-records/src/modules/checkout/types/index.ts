export type PaymentDetails = {
  id: string;
  amount: number;
  type: "payment";
  method: string;
  status: "pending" | "failed" | "success" | "successful";
  country: string;
  country_code: string;
  currency: string;
  reference: string;
  business_id: string;
  created_at: string;
  environment: string;
  redirect_url: string;
  email: string;
  customer?: any;
  customer_first_name: string;
  customer_last_name: string;
  phone_number: string;
  provider_transaction_id: string;
  operator: string;
  attempts: number;
  attempt_again: number;
  charge: number;
};

export type PaymentStatus = "pending" | "failed" | "success" | "successful";

export type MobileMoneyPaymentRequest = {
  phone_number: string;
  method: string;
  country: string;
  business_name: string;
  reference: string;
};

export type CardPaymentRequest = {
  phone_number?: string;
  email: string;
  customer_first_name: string;
  customer_last_name: string;
  isSubscription?: boolean;
  ip_address?: string;
};

export interface CardPaymentResponse {
  device_storage_token: {
    methodPostData: string;
    methodUrl: string;
    domainName: string;
    html: string;
    customizedHtml: {
      "3ds2": {
        acsUrl: string;
        cReq: string;
      };
    };
  };
  message: string;
  method: string;
  operator: string | null;
  payment_status: string;
}
