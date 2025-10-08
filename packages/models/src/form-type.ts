export enum IInputType {
  Text = "text",
  Email = "email",
  Password = "password",
  Date = "date",
  Number = "number",
  Search = "search",
  Url = "url",
}

export enum ISelectType {
  Single = "single",
  Multi = "multiple",
}

export interface IInputValidator {
  validator: string;
  range?: number;
  message?: string;
}

export interface ITextInputField {
  labelId?: string;
  labelTitle?: string;
  labelCompact?: boolean;
  inputType: IInputType;
  inputValue?: string | number;
  inputPlaceholder?: string;
  inputBaseColor?: string;
  isTextArea?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  suffixText?: string;
  showPasswordDisplay?: boolean;
  showTextCopy?: boolean;
  copiedText?: string;
  placeTextCenter?: boolean;
  hasBottomPadding?: boolean;
  errorHandler?: IInputValidator;
}

export interface IPhoneInputField {
  labelId: string;
  labelTitle?: string;
  labelCompact?: boolean;
  inputValue: string | number;
  inputPlaceholder?: string;
  inputBaseColor?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  activeCountryCode?: string;
  hasBottomPadding?: boolean;
  showMoreOptions?: boolean;
  errorHandler?: IInputValidator;
}

export interface ISelectInputField {
  labelId?: string;
  labelTitle?: string;
  labelCompact?: boolean;
  inputValue?: string;
  inputPlaceholder?: string;
  inputBaseColor?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  selectData: { value: string; name: string }[];
  hasBottomPadding?: boolean;
}

export interface IMultiInputField {
  labelId?: string;
  labelTitle?: string;
  labelCompact?: boolean;
  inputValueList: string[];
  inputPlaceholder?: string;
  inputBaseColor?: string;
  selectData: { value: string; name: string }[];
  hasBottomPadding?: boolean;
}

export interface ISelectDropdown {
  selectData: any[];
  selectType: ISelectType;
  onSelectChange?: (value: string) => void;
}

export interface ICountryItem {
  country: string;
  dialing_code: string;
  code: string;
  flag: string;
  currency?: {
    sign: string;
    short: string;
    long: string;
    description: string;
  };
}
