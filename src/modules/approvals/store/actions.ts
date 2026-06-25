import constants from "@/shared/utilities/constants";
import { useServiceAPI } from "@packages/hooks";
import { approvalRoutes } from "./approval-routes";

const { PORTAL_API_BASE_URL, PORTAL_API_VERSION, PORTAL_AUTH_TOKEN } =
  constants;

const $api = new useServiceAPI({
  API_BASE_URL: PORTAL_API_BASE_URL,
  API_VERSION: PORTAL_API_VERSION,
  TOKEN_KEY: PORTAL_AUTH_TOKEN,
});

export const getAllApprovals = async (payload: any) => {
  const queryString =
    payload.filters &&
    typeof payload.filters === "string" &&
    payload.filters.length > 0
      ? payload.filters
      : `?page=${payload.page ?? 1}`;
  return await $api.fetch(`${approvalRoutes.getApprovals}${queryString}`);
};

export const decideApproval = async (payload: {
  uuid: string
  comment?: string
}) => {
  return await $api.push(
    `${approvalRoutes.decideApproval}/${payload.uuid}/verify`,
    { comment: payload.comment || "Request confirmed by admin" },
  );
};
