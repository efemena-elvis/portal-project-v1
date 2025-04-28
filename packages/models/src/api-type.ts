export interface IAPIType {
  status: string;
  code: number;
  message: string;
  data: any;
}

export type PaymentMethods = "card" | "mobilemoney";
