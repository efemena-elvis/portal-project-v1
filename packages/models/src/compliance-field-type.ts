import { IInputType } from "./form-type";

export enum IFieldType {
  Text = "text",
  Email = "email",
  Password = "password",
  Date = "date",
  Number = "number",
  Phone = "phone",
  FileUpload = "fileUpload",
  Select = "select",
  MultiSelect = "multiSelect",
  TextArea = "textArea",
}

export interface ISelectOption {
  value: string;
  name: string;
  image?: string;
}

export interface IComplianceFieldConfig {
  id: string;
  labelId: string;
  labelTitle: string;
  fieldType: IFieldType;
  inputType: IInputType;
  inputPlaceholder: string;
  isRequired: boolean;
  selectOptions?: ISelectOption[];
  position: number;
}
