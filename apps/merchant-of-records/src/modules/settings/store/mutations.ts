import {
  profileDetails,
  profileContact,
  profileAccount,
  profileDeveloper,
} from "./state";

export function useSettingsMutations() {
  const mutateProfile = (response: any) => {
    const responsePayload = response.data;
    // console.log("RESPONSE", responsePayload);

    const { first_name, last_name, phone_number } =
      responsePayload.business_users[0].user;

    profileDetails.value = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      logo: responsePayload?.logo,
    };

    profileContact.value = {
      dispute_email_address: responsePayload?.dispute_email_address,
      support_email_address: responsePayload?.support_email_address,
      general_email_address: responsePayload?.general_email_address,
    };

    profileAccount.value = {
      name: responsePayload?.bank_name,
      account_number: responsePayload?.bank_account_number,
      code: responsePayload?.bank_code,
      account_holder_name: responsePayload?.bank_account_holder_name,
    };

    const activeAPIURL = responsePayload.apikeys.find(
      (key: any) => key.type === responsePayload.mode
    );

    profileDeveloper.value = {
      callback_url: activeAPIURL?.callback_url,
      webhook_url: activeAPIURL?.webhook_url,
    };
  };

  return {
    mutateProfile,
  };
}
