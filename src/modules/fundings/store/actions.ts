import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { fundingRoutes } from "./funding-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getAllFundings = async (payload: any) => {
  const queryString =
    payload.filters &&
    typeof payload.filters === "string" &&
    payload.filters.length > 0
      ? payload.filters
      : `?page=${payload.page ?? 1}`;
  return await $api.fetch(`${fundingRoutes.getFundings}${queryString}`);
};

// export const getSingleFunding = async (id: string) => {
//   return await $api.fetch(`${fundingRoutes.getSingleFunding}/${id}`);
// };

export const verifyFunding = async (payload: {
  uuid: string
  comment?: string
}) => {
  return await $api.push(
    `${fundingRoutes.verifyFunding}/${payload.uuid}/verify`,
    { comment: payload.comment || "Payment confirmed by admin" },
  );
};
