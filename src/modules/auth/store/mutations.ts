import axios from "axios";
import { useAuthState } from "./state";
import { useStorage, useString } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

const { setStorage } = useStorage();
const { encodeString, getRandomString } = useString();
const {
  PORTAL_AUTH_TOKEN,
  PORTAL_AUTH_USER,
  PORTAL_AUTH_BUSINESS,
  PORTAL_AUTH_BUSINESS_TOKEN,
  PORTAL_REFRESH_TOKEN,
} = constants;

export function useAuthMutations() {
  const { authToken, authUser, authBusiness, authBusinessToken, refreshToken } =
    useAuthState();

  const mutateUserData = (responsePayload: any) => {
    try {
      mutateAuthToken(responsePayload);
    } catch (error) {}

    try {
      mutateAuthUser(responsePayload);
    } catch (error) {}

    try {
      mutateAuthBusiness(responsePayload);
    } catch (error) {}

    try {
      mutateAuthBusinessToken(responsePayload);
    } catch (error) {
      console.error(error);
    }

    try {
      mutateRefreshToken(responsePayload);
    } catch (error) {}
  };

  // MUTATE AUTH TOKEN
  const mutateAuthToken = (payload: any) => {
    // Support both old (auth_token) and new (access_token) API formats
    const token = payload.auth_token || payload.access_token;

    if (!token) {
      return;
    }

    authToken.value = token;
    axios.defaults.headers.common.Authorization = token;

    setStorage({
      storage_name: PORTAL_AUTH_TOKEN,
      storage_value: token,
    });

    setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });
  };

  // MUTATE AUTH USER
  const mutateAuthUser = (payload: any) => {
    const { user } = payload;

    if (!user) {
      return;
    }

    authUser.value = {
      id: user.id || user.uuid,
      email: user.email,
      country: user.country || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      currentBusiness: user.current_business || null,
      isEmailVerified:
        payload.is_email_verified || user.email_verified || false,
    };

    setStorage({
      storage_name: PORTAL_AUTH_USER,
      storage_value: authUser.value,
      storage_type: "object",
    });
  };

  // MUTATE AUTH BUSINESS
  const mutateAuthBusiness = (payload: any) => {
    // Handle optional business data - newer API may not include business_users
    const businessUser = payload.user?.business_users?.[0];
    const business = businessUser?.business;

    if (!business) {
      return;
    }

    authBusiness.value = {
      businessAddress: business.address,
      bankAccountNumber: encodeString(business.bank_account_number),
      bankName: encodeString(business.bank_name),
      disputeEmailAddress: business.dispute_email_address,
      generalEmailAddress: business.general_email_address,
      businessId: business.id,
      businessLogo: business.logo,
      businessMode: business.mode,
      businessName: business.name,
      businessSector: business.sector,
      activated: encodeString(business.business_activated),
      supportEmailAddress: business.support_email_address,
      activateMyBusiness: payload.activate_my_business,
    };

    setStorage({
      storage_name: PORTAL_AUTH_BUSINESS,
      storage_value: authBusiness.value,
      storage_type: "object",
    });
  };

  const mutateBusinessMode = (mode: string) => {
    authBusiness.value.businessMode = mode;

    setStorage({
      storage_name: PORTAL_AUTH_BUSINESS,
      storage_value: authBusiness.value,
      storage_type: "object",
    });
  };

  // MUTATE AUTH BUSINESS TOKEN
  const mutateAuthBusinessToken = (payload: any) => {
    // Handle optional API keys - newer API may not include this
    const apikeys = payload.user?.business_users?.[0]?.business?.apikeys;

    if (!apikeys) {
      return;
    }

    const testData = apikeys.find((key: any) => key.type === "test") || {};
    const liveData = apikeys.find((key: any) => key.type === "live") || {};

    const authToken: { playground?: any; alcatraz?: any } = {
      playground: {},
      alcatraz: {},
    };

    if (Object.keys(testData).length) {
      authToken.playground = {
        nigeria: encodeString(testData.public_key), // public test key
        ghana: encodeString(`${getRandomString(30)}-#!${getRandomString(30)}`), // dummy
        unitedKingdom: encodeString(testData.secret_key), // secret test key
        unitedStateofAmerica: encodeString(
          `${getRandomString(25)}-@-${getRandomString(28)}`,
        ), // dummy
      };
    }

    if (Object.keys(liveData).length) {
      authToken.alcatraz = {
        nigeria: encodeString(liveData.public_key), // public live key
        ghana: encodeString(`${getRandomString(30)}-${getRandomString(30)}`), // dummy
        unitedKingdom: encodeString(liveData.secret_key), // secret live key
        unitedStateofAmerica: encodeString(
          `${getRandomString(25)}-??-${getRandomString(28)}`,
        ), // dummy
      };
    }

    authBusinessToken.value = authToken;

    setStorage({
      storage_name: PORTAL_AUTH_BUSINESS_TOKEN,
      storage_value: authBusinessToken.value,
      storage_type: "object",
    });
  };

  const mutateRefreshToken = (payload: any) => {
    const token = payload.refresh_token;
    if (!token) return;

    refreshToken.value = token;

    setStorage({
      storage_name: PORTAL_REFRESH_TOKEN,
      storage_value: token,
    });
  };

  return {
    mutateUserData,
    mutateBusinessMode,
    mutateAuthToken,
    mutateRefreshToken,
  };
}
