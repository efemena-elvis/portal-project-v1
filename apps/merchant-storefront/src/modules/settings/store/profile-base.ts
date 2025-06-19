export interface IProfileDetails {
  first_name: string;
  last_name: string;
  phone_number: string;
  logo: string;
}

export interface IProfileContact {
  dispute_email_address: string;
  support_email_address: string;
  general_email_address: string;
}

export interface IProfileDeveloper {
  callback_url: string;
  webhook_url: string;
}

export interface IProfileAccount {
  name: string;
  account_number: string | number;
  code: string;
  account_holder_name: string;
}

interface IProfileBaseType extends IProfileDeveloper {
  profile: IProfileDetails;
  contact: IProfileContact;
  bank: IProfileAccount;
}

export const profileBase: IProfileBaseType = {
  callback_url: "",
  webhook_url: "",
  bank: {
    name: "",
    account_number: "",
    code: "",
    account_holder_name: "",
  },
  contact: {
    dispute_email_address: "",
    support_email_address: "",
    general_email_address: "",
  },
  profile: {
    logo: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  },
};
