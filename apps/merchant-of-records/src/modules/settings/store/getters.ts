import { computed } from "vue";
import {
  profileDetails,
  profileContact,
  profileAccount,
  profileDeveloper,
} from "./state";

export const getProfileDetails = computed(() => profileDetails.value);
export const getProfileContact = computed(() => profileContact.value);
export const getProfileAccount = computed(() => profileAccount.value);
export const getProfileDeveloper = computed(() => profileDeveloper.value);
