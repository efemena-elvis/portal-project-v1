import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { transactionRoutes } from "./transaction-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getAllTransactions = async (payload: any) => {
  const filters = payload.filters
    ? `${payload.filters}&environment=${payload.environment || "live"}`
    : `?page=${payload.page}&environment=${payload.environment || "live"}`;
  return await $api.fetch(
    `${transactionRoutes.getTransactions}${filters}`,
  );
};

export const getSingleTransaction = async (payload: any) => {
  return await $api.fetch(
    `${transactionRoutes.getTransactions}/${payload.uuid}`,
  );
};
