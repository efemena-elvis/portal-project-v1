import { ref } from "vue";
import { useStorage } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

interface IAuthBusiness {
  businessAddress: string;
  bankAccountNumber: string;
  bankName: string;
  disputeEmailAddress: string;
  generalEmailAddress: string;
  businessId: string;
  businessLogo: string;
  businessMode: string;
  businessName: string;
  businessSector: string;
  activated: string;
  supportEmailAddress: string;
  activateMyBusiness: boolean;
}

const { getStorage } = useStorage();
const {
  PORTAL_AUTH_TOKEN,
  PORTAL_AUTH_USER,
  PORTAL_AUTH_BUSINESS,
  PORTAL_AUTH_BUSINESS_TOKEN,
  PORTAL_REFRESH_TOKEN,
} = constants;

export function useAuthState() {
  const authToken = ref<string | object>(
    getStorage({
      storage_name: PORTAL_AUTH_TOKEN,
    }) || "",
  );

  const authUser = ref<string | object>(
    getStorage({
      storage_name: PORTAL_AUTH_USER,
      storage_type: "object",
    }) || "",
  );

  const authBusiness = ref<IAuthBusiness>(
    getStorage({
      storage_name: PORTAL_AUTH_BUSINESS,
      storage_type: "object",
    }) as IAuthBusiness,
  );

  const authBusinessToken = ref<string | object>(
    getStorage({
      storage_name: PORTAL_AUTH_BUSINESS_TOKEN,
      storage_type: "object",
    }) || "",
  );

  const refreshToken = ref<string>(
    (getStorage({
      storage_name: PORTAL_REFRESH_TOKEN,
    }) as string) || "",
  );

  return {
    authToken,
    authUser,
    authBusiness,
    authBusinessToken,
    refreshToken,
  };
}
