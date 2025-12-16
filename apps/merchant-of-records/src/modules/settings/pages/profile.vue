<template>
  <div class="profile-area">
    <div class="profile-input">
      <div class="title-text">{{ getBusinessProfile?.businessName }}</div>

      <FileUploadInput
        :showSkip="false"
        :hasDocumentUploaded="false"
        :uploadAction="uploadFile"
        fileUploadText="Upload your business logo"
        :uploadedDocumentContent="getUploadedDocumentContent"
        @onDocumentUploaded="
          {
            businessLogo = $event;
            businessPayload.logo = $event;
          }
        "
      />

      <!-- INPUT AREA -->
      <div class="mt-8">
        <TextFieldInput
          labelId="businessEmailAddress"
          labelTitle="Business Email Address"
          :labelCompact="false"
          :inputType="IInputType.Email"
          :inputValue="businessPayload.email_address"
          inputPlaceholder="Provide a business email address"
          :isRequired="true"
          :isDisabled="true"
        />

        <!-- <TextFieldInput
          labelId="businessLocation"
          labelTitle="Business Location"
          :labelCompact="false"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.business_location"
          inputPlaceholder="Provide a business location"
          :isRequired="true"
          :isDisabled="true"
        /> -->

        <SelectFieldInput
          labelId="businessCountry"
          labelTitle="Business Location"
          :labelCompact="false"
          inputPlaceholder="Select country of business registeration"
          :inputValue="businessPayload.business_location"
          :selectData="validCountries"
          isRequired
          @onSelectionChange="businessPayload.business_location = $event"
        />

        <SelectFieldInput
          labelId="businessTimezone"
          labelTitle="Business Timezone"
          :labelCompact="false"
          inputPlaceholder="Select a business timezone"
          :inputValue="businessPayload.timezone"
          :selectData="validTimezones"
          isRequired
          @onSelectionChange="businessPayload.timezone = $event"
        />

        <!-- PASSWORD -->
        <TextFieldInput
          labelId="userPassword"
          labelTitle="Password"
          :labelCompact="false"
          :inputType="IInputType.Password"
          inputValue="*****************"
          inputPlaceholder="Please enter your password"
          isRequired
          :isDisabled="true"
        />

        <!-- CHANGE PASSWORD SECTION -->
        <div class="mt-4">
          <div class="font-medium link" @click="toggleChangePasswordModal">
            Change Password
          </div>
        </div>
      </div>
      <button
        class="w-full mt-8 btn btn-primary"
        :disabled="isActionReady"
        @click="updateProfile"
      >
        Update Profile
      </button>
    </div>

    <div class="profile-display">
      <div class="pt-12 logo-area">
        <div class="logo-wrapper">
          <img
            class="w-4/5 h-auto"
            :src="businessLogo"
            alt="Business Logo"
            v-if="businessLogo"
          />

          <img
            class="w-4/5 h-auto"
            src="@images/no-logo.png"
            alt="Business Logo"
            v-else
          />
        </div>
      </div>
    </div>
  </div>

  <teleport to="body" v-if="showChangePasswordModal">
    <ChangePasswordModal @closeTriggered="toggleChangePasswordModal" />
  </teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IInputType } from "@packages/models";
import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";
import { useSettingsStore } from "@/modules/settings/store";
import { countryTimezones } from "@packages/constants";
import { useProfile, useEvents } from "@packages/hooks";
import merchantCountries from "@/shared/utilities/merchant-countries";
import {
  TextFieldInput,
  FileUploadInput,
  SelectFieldInput,
} from "@packages/uikit";
import ChangePasswordModal from "@/modules/settings/modals/change-password-modal.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

type IProfileType = {
  email_address: string;
  business_location: string;
  timezone: string;
  logo: string;
};

const authStore = useAuthStore();
const { uploadFile } = useGlobalStore();
const { fetchUserProfile, updateUserProfile } = useSettingsStore();

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());

const profileUtil = new useProfile(authStore);
const { processAPIRequest } = useEvents();
const { getBusinessCountries } = useGlobalStore();

const businessLogo = ref<string>("");
const showChangePasswordModal = ref<boolean>(false);

const uploadedDocumentContent = ref<{ name: string; link: string }>({
  name: "Business Logo",
  link: getProfileDetails.value?.logo || "",
});

const getUploadedDocumentContent = computed(() => {
  return uploadedDocumentContent.value;
});

const validCountries = ref<{ value: string; name: string }[]>([
  {
    value: "98e7ad5b-d718-41d1-ab38-10a245ff4279",
    name: "Nigeria",
  },
]);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const getUserProfile = computed(() => profileUtil.getUser());

const businessPayload = ref<IProfileType>({
  email_address: getUserProfile?.value?.email || "",
  business_location: getUserProfile?.value?.country?.id || "",
  timezone: getProfileDetails.value?.timezone || "",
  logo: "",
});

console.log("businessPayload", businessPayload);

const validTimezones = computed(() => {
  return countryTimezones.map((timezone) => {
    return { name: timezone.timezone, value: timezone.timezone };
  });
});

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value, ...businessPayload.value },
    bank: { ...getProfileAccount.value },
    contact: { ...getProfileContact.value },
    ...getProfileDeveloper.value,
  };
});

const toggleChangePasswordModal = () => {
  showChangePasswordModal.value = !showChangePasswordModal.value;
};

const fetchCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const merchantCountryCodes = new Set(
      merchantCountries.map((merchant) => merchant.code.toLowerCase())
    );

    const filteredCountries = response.data
      .filter((country: any) =>
        merchantCountryCodes.has(country.country_code.toLowerCase())
      )
      .map((country: any) => ({
        name: country.name,
        value: country.id,
      }))
      .sort((a: any, b: any) => a.name.localeCompare(b.name));

    // const getNigeria = filteredCountries.find(
    //   (country: any) => country.name === "Nigeria"
    // );

    validCountries.value = filteredCountries;
    // businessPayload.value.business_location = getNigeria.value;
  }
};

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });
};

const updateProfile = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    btnText: "Update Profile",
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Profile updated successfully",
        type: "success",
      },
      400: {
        message: "Profile update failed",
        type: "error",
      },
    },
  });
};

const isActionReady = computed(() => {
  return businessPayload.value.logo &&
    businessPayload.value.business_location &&
    businessPayload.value.email_address &&
    businessPayload.value.timezone
    ? false
    : true;
});

watch(
  getProfileDetails,
  (newValue) => {
    if (newValue) {
      businessLogo.value = newValue.logo || "";
      businessPayload.value.logo = newValue.logo || "";
      businessPayload.value.timezone = newValue.timezone || "";
      businessPayload.value.business_location =
        getUserProfile?.value?.country?.id || "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  fetchCountries();
  fetchProfileData();
});
</script>

<style lang="scss" scoped>
.profile-area {
  @apply flex justify-between items-start gap-x-4 sm:flex-col;

  .profile-input {
    @apply w-[48%] sm:w-full;

    .title-text {
      @apply mb-6 text-2xl font-semibold text-grey-900;
    }
  }

  .profile-display {
    @apply w-[45%];
  }
}
</style>
