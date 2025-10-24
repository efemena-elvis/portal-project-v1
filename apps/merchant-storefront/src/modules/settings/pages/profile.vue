<template>
  <div class="profile-area">
    <div class="profile-input">
      <div class="title-text">{{ getBusinessProfile?.businessName }}</div>

      <FileUploadInput
        :showSkip="false"
        :hasDocumentUploaded="false"
        :uploadAction="uploadFile"
        fileUploadText="Upload your business logo"
        @onDocumentUploaded="
          {
            businessLogo = $event;
            updateBusinessLogo();
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

        <TextFieldInput
          labelId="businessLocation"
          labelTitle="Business Location"
          :labelCompact="false"
          :inputType="IInputType.Text"
          :inputValue="businessPayload.business_location"
          inputPlaceholder="Provide a business location"
          :isRequired="true"
          :isDisabled="true"
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

  <teleport to="body" v-if="showChangePasswordtModal">
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
import {
  TextFieldInput,
  FileUploadInput,
  SelectFieldInput,
} from "@packages/uikit";
import ChangePasswordModal from "@/modules/settings/modals/change-password-modal.vue";
import { storeToRefs } from "pinia";

type IProfileType = {
  email_address: string;
  business_location: string;
  timezone: string;
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

const businessLogo = ref<string>("");
const showChangePasswordtModal = ref<boolean>(false);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const getUserProfile = computed(() => profileUtil.getUser());

const businessPayload = ref<IProfileType>({
  email_address: getUserProfile?.value?.email || "",
  business_location: getUserProfile?.value?.country?.name || "",
  timezone: "",
});

const validTimezones = computed(() => {
  return countryTimezones.map((timezone) => {
    return { name: timezone.timezone, value: timezone.timezone };
  });
});

const getPayload = computed(() => {
  return {
    profile: { logo: businessLogo.value, ...getProfileDetails.value },
    bank: { ...getProfileAccount.value },
    contact: { ...getProfileContact.value },
    ...getProfileDeveloper.value,
  };
});

const toggleChangePasswordModal = () => {
  showChangePasswordtModal.value = !showChangePasswordtModal.value;
};

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });
};

const updateBusinessLogo = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    payload: getPayload.value,
    alertHandler: {
      201: {
        message: "Business logo uploaded successfully",
        type: "success",
      },

      400: {
        message: "Business logo upload failed",
        type: "error",
      },
    },
  });
};

watch(
  getProfileDetails,
  (newValue) => {
    if (newValue) {
      businessLogo.value = newValue.logo || "";
    }
  },
  { immediate: true }
);

fetchProfileData();
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
