import axios from "axios";
import { useAuthState } from "./state";
import { useStorage, useString } from "@packages/hooks";
import constants from "@/shared/utilities/constants";

const { setStorage } = useStorage();
const { encodeString, getRandomString } = useString();
const {
  MOR_AUTH_TOKEN,
  MOR_AUTH_USER,
  MOR_AUTH_BUSINESS,
  MOR_AUTH_BUSINESS_TOKEN,
} = constants;

export function useAuthMutations() {
  const { authToken, authUser, authBusiness, authBusinessToken } =
    useAuthState();

  const mutateUserData = (responsePayload: any) => {
    mutateAuthToken(responsePayload);
    mutateAuthUser(responsePayload);
    mutateAuthBusiness(responsePayload);
    mutateAuthBusinessToken(responsePayload);
  };

  // MUTATE AUTH TOKEN
  const mutateAuthToken = (payload: any) => {
    authToken.value = payload.auth_token;
    axios.defaults.headers.common["Authorization"] = payload.auth_token;

    setStorage({
      storage_name: MOR_AUTH_TOKEN,
      storage_value: payload.auth_token,
    });

    setStorage({
      storage_name: "timestamp",
      storage_value: +new Date(),
    });
  };

  // MUTATE AUTH USER
  const mutateAuthUser = (payload: any) => {
    const { user } = payload;

    authUser.value = {
      id: user.id,
      email: user.email,
      country: user.country,
      firstName: user.first_name,
      lastName: user.last_name,
      currentBusiness: user.current_business,
      isEmailVerified: payload.is_email_verified,
      morAccountType: user.mor_account_type,
    };

    setStorage({
      storage_name: MOR_AUTH_USER,
      storage_value: authUser.value,
      storage_type: "object",
    });
  };

  // MUTATE AUTH BUSINESS
  const mutateAuthBusiness = (payload: any) => {
    const { business } = payload.user.business_users[0];

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
      storage_name: MOR_AUTH_BUSINESS,
      storage_value: authBusiness.value,
      storage_type: "object",
    });
  };

  const mutateBusinessMode = (mode: string) => {
    authBusiness.value.businessMode = mode;

    setStorage({
      storage_name: MOR_AUTH_BUSINESS,
      storage_value: authBusiness.value,
      storage_type: "object",
    });
  };

  // MUTATE AUTH BUSINESS TOKEN
  const mutateAuthBusinessToken = (payload: any) => {
    const { apikeys } = payload.user.business_users[0].business;

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
          `${getRandomString(25)}-@-${getRandomString(28)}`
        ), // dummy
      };
    }

    if (Object.keys(liveData).length) {
      authToken.alcatraz = {
        nigeria: encodeString(liveData.public_key), // public live key
        ghana: encodeString(`${getRandomString(30)}-${getRandomString(30)}`), // dummy
        unitedKingdom: encodeString(liveData.secret_key), // secret live key
        unitedStateofAmerica: encodeString(
          `${getRandomString(25)}-??-${getRandomString(28)}`
        ), // dummy
      };
    }

    authBusinessToken.value = authToken;

    setStorage({
      storage_name: MOR_AUTH_BUSINESS_TOKEN,
      storage_value: authBusinessToken.value,
      storage_type: "object",
    });
  };

  return {
    mutateUserData,
    mutateBusinessMode,
  };
}
