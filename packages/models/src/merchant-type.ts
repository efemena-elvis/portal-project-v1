export interface IDirectorOrOwnerType {
  
  [key: string]: any;
}

export interface IMerchantType {
  id: number;
  business_name: string;
  mcc: string;
  country_id: string;
  email: string;
  phone_number: string;
  website_link: string;
  director1: IDirectorOrOwnerType;
  director2?: IDirectorOrOwnerType;
  ultimate_business_owner1: IDirectorOrOwnerType;
  ultimate_business_owner2?: IDirectorOrOwnerType;
  form_3: string;
  business_certificate: string;
  [key: string]: any;
}

export interface ITableHeaderType {
  key: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  readonly?: boolean;
}


export interface IStepType {
  step: number;
  label: string;
  optional?: boolean;
}



