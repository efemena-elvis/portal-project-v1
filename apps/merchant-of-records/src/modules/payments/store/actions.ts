import { useServiceAPI } from "@packages/hooks";
import { paymentRoutes } from "./payment-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { computed } from "vue";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";
const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public
);

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
});

export const getTransactions = async () => {
  return await $api.fetch(paymentRoutes.getPaymentTransactions, {
    headers: {
      "public-key": publicKey.value,
    },
  });
};

export const getCustomers = async () => {
  return await $api.fetch(paymentRoutes.getCustomers, {
    headers: {
      "public-key": publicKey.value,
    },
  });
};
