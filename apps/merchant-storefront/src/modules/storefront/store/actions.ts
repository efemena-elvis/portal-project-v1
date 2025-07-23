import { useServiceAPI } from "@packages/hooks";
import { storeRoutes } from "./store-routes";
import constants from "@/shared/utilities/constants";
import { useProfile } from "@packages/hooks";
import { useAuthStore } from "@/modules/auth/store";
import { activeStore } from "./state";

const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const getBusinessProfile = () => profileUtil.getBusiness();
const getActiveMode = () => getBusinessProfile()?.businessMode || "test";

const getPublicKey = () => {
  const mode = getActiveMode();
  return mode === "test"
    ? profileUtil.getAPIKeys().test.public
    : profileUtil.getAPIKeys().live.public;
};

const getSecretKey = () => {
  const mode = getActiveMode();
  return mode === "test"
    ? profileUtil.getAPIKeys().test.secret
    : profileUtil.getAPIKeys().live.secret;
};

const $api = new useServiceAPI({
  API_BASE_URL: MOR_API_BASE_URL,
  API_VERSION: MOR_API_VERSION,
  TOKEN_KEY: MOR_AUTH_TOKEN,
});

const authHeaders = () => ({
  "public-key": getPublicKey(),
  "secret-key": getSecretKey(),
});

export const createStorefront = async (payload: any) => {
  return await $api.push(storeRoutes.createStorefront, payload, {
    headers: authHeaders(),
  });
};

export const getStoreList = async () => {
  return await $api.fetch(storeRoutes.getStoreList, { headers: authHeaders() });
};

export const getStoreDetails = async () => {
  return await $api.fetch(storeRoutes.getStoreDetails, {
    headers: authHeaders(),
  });
};

export const addProduct = async (payload: any) => {
  return await $api.push(storeRoutes.addProduct, payload, {
    headers: authHeaders(),
  });
};
export const getStoreProducts = async (slug: string) => {
  return await $api.fetch(`${storeRoutes.getStoreProducts}?slug=${slug}`, {
    headers: authHeaders(),
  });
};
export const getProductsSummary = async (slug: string) => {
  return await $api.fetch(
    `${storeRoutes.getProductsSummary.replace(":store_id", slug)}`,
    {
      headers: authHeaders(),
    }
  );
};

export const getStoreOrders = async (id: string) => {
  return await $api.fetch(storeRoutes.getStoreOrders.replace(":store_id", id), {
    headers: authHeaders(),
  });
};

export const getStoreCustomers = async (id: string) => {
  return await $api.fetch(
    storeRoutes.getStoreCustomers.replace(":store_id", id),
    {
      headers: authHeaders(),
    }
  );
};

export const setActiveStore = (store: any) => {
  activeStore.value = store;
};
