import { ref } from "vue";

export type IWalletBalance = {
  countryFlag: string;
  description: string;
  currencyShort: string;
  currencySign: string;
  amount: number;
};

export const walletBalance = ref<IWalletBalance[]>([]);
