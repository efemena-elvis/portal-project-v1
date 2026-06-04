import { useServiceAPI } from "@packages/hooks";
import { globalRoutes } from "./global-routes";
import constants from "@/shared/utilities/constants";
import { useAuthMutations } from "@/modules/auth/store/mutations";
import axios from "axios";

export function useGlobalActions() {
  const { MOR_API_BASE_URL, MOR_API_VERSION, MOR_AUTH_TOKEN } = constants;

  const $api = new useServiceAPI({
    API_BASE_URL: MOR_API_BASE_URL,
    API_VERSION: MOR_API_VERSION,
    TOKEN_KEY: MOR_AUTH_TOKEN,
  });

  const { mutateBusinessMode } = useAuthMutations();

  const uploadFile = async (payload: any) => {
    const response: any = await $api.push(globalRoutes.fileUpload, payload, {
      hasAttachment: true,
    });
    return response;
  };

  const switchAppMode = async (payload: any) => {
    const response: any = await $api.push(globalRoutes.switchMode, payload);
    mutateBusinessMode(payload.mode);
    return response;
  };

  const contactSupport = async (payload: any) => {
    return await $api.push(globalRoutes.contactSupport, payload, {
      //   requiresPublicKey: true,
    });
  };

  const getBusinessCountries = async () => {
    return await $api.fetch(globalRoutes.countries);
  };

  return {
    uploadFile,
    switchAppMode,
    contactSupport,
    getBusinessCountries,
  };
}
