import { computed } from "vue";
import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { storeRoutes } from "./store-routes";

const { APP_API_BASE_URL, APP_API_VERSION, APP_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const activeMode = getBusinessProfile.value?.businessMode || "test";

const publicKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public,
);

const secretKey = computed(() =>
  activeMode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret,
);

const $api = new useServiceAPI({
  API_BASE_URL: APP_API_BASE_URL,
  API_VERSION: APP_API_VERSION,
  TOKEN_KEY: APP_AUTH_TOKEN,
  HEADERS: {
    "public-key": publicKey.value,
    "secret-key": secretKey.value,
  },
});

export const createStorefront = async (payload: any) => {
  return await $api.push(storeRoutes.createStorefront, payload);
};

export const fetchStorefront = async () => {
  return await $api.fetch(storeRoutes.fetchStorefront);
};

export const fetchStoreById = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.fetchStoreById}/${payload.storeId}`);
};

export const updateStorefront = async (payload: any) => {
  return await $api.update(storeRoutes.updateStorefront, payload);
};

export const deleteStorefront = async (payload: any) => {
  return await $api.delete(
    `${storeRoutes.deleteStorefront}/${payload.storefrontId}`,
  );
};

export const getStoreProducts = async (payload: any) => {
  return await $api.fetch(
    `${storeRoutes.getProducts}?slug=${payload.storefrontSlug}&page=${payload.page}`,
  );
};

export const createStoreProduct = async (payload: any) => {
  return await $api.push(storeRoutes.addProducts, payload);
};

export const updateStoreProduct = async (payload: any) => {
  return await $api.update(storeRoutes.editProduct, payload);
};

export const deleteStoreProduct = async (payload: any) => {
  return await $api.delete(`${storeRoutes.deleteProduct}/${payload.productId}`);
};

export const getStoreOrders = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.getOrders}/${payload.storefrontId}?page=${payload.page}`);
};

export const updateOrderStatus = async (payload: any) => {
  return await $api.update(`${storeRoutes.updateOrderStatus}`, payload);
};

export const viewOrderDetails = async (payload: any) => {
  return await $api.fetch(`${storeRoutes.viewOrderDetails}/${payload.orderId}`);
};
