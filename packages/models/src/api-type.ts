export interface IAPIType {
  status: string;
  code: number;
  message: string;
  data: any;
}

export interface ApiResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export type PaymentMethods = "card" | "mobilemoney";
