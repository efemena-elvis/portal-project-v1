import { ref } from "vue";
import {
  IProfileDetails,
  IProfileContact,
  IProfileAccount,
  IProfileDeveloper,
} from "./profile-base";

export const profileDetails = ref<IProfileDetails>();
export const profileContact = ref<IProfileContact>();
export const profileAccount = ref<IProfileAccount>();
export const profileDeveloper = ref<IProfileDeveloper>();
