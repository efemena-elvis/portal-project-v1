<template>
   <div class="mb-6 text-[18px]">
    <p class="font-semibold">Manage your API configurations</p>
    <span class="mt-1 text-[14px] text-grey-500">
    Easily configure and manage your API settings to ensure seamless integration with your services.
    </span>
  </div>
  <div class="developer-area">
    <div class="developer-input">
      <div class="input-form mb-7">
        <TextFieldInput
          labelId="textSecretKey"
          labelTitle="Test Secret Key"
          :labelCompact="false"
          :inputType="IInputType.Password"
          :inputValue="getKeys.secret"
          inputPlaceholder="Secret key"
          inputBaseColor="bg-grey-10"
          :showTextCopy="true"
          copiedText="Secret key copied successfully"
          :isRequired="true"
          :isDisabled="true"
        />

        <TextFieldInput
          labelId="textPublicKey"
          labelTitle="Test Public Key"
          :labelCompact="false"
          :inputType="IInputType.Text"
          :inputValue="getKeys.public"
          inputPlaceholder="Public key"
          inputBaseColor="bg-grey-10"
          :showTextCopy="true"
          copiedText="Public key copied successfully"
          :isRequired="true"
          :isDisabled="true"
        />

        <TextFieldInput
          labelId="textCallbackURL"
          labelTitle="Test Callback URL"
          :labelCompact="false"
          :inputType="IInputType.Text"
          inputPlaceholder="Callback URL"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          :inputValue="urlPayload.callback_url"
          @inputChanged="urlPayload.callback_url = $event"
          @inputValidated="payloadValidity.callback_url = $event"
        
        />

        <TextFieldInput
          labelId="textWebhookURL"
          labelTitle="Test Webhook URL"
          :labelCompact="false"
          :inputType="IInputType.Text"
          inputPlaceholder="Webhook URL"
          inputBaseColor="bg-grey-10"
          :isRequired="true"
          :inputValue="urlPayload.webhook_url"
          @inputChanged="urlPayload.webhook_url = $event"
          @inputValidated="payloadValidity.webhook_url = $event"
   
        />
      </div>

      <button
        class="w-full mt-3 btn btn-primary"
        ref="updateKeysBtnRef"
        :disabled="isActionReady"
        @click="updateProfileAPIKeys"
      >
        Update API Keys
      </button>
    </div>

    <div class="developer-display">
      <div class="help-area">
        <div class="body-text text-grey-900">
          Need help integrating our APIs on your platform?
        </div>

        <button class="btn btn-sm btn-tertiary sm:mt-4">Explore our APIs</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { IInputType } from "@packages/models";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/modules/auth/store";
import { useSettingsStore } from "@/modules/settings/store";
import { useEvents, useProfile } from "@packages/hooks";
import { TextFieldInput } from "@packages/uikit";

type IURLType = {
  callback_url: string;
  webhook_url: string;
};

type IInputValidity = {
  callback_url: boolean;
  webhook_url: boolean;
};

const authStore = useAuthStore();
const { fetchUserProfile, updateUserProfile } = useSettingsStore();

const profileUtil = new useProfile(authStore);
const { processAPIRequest } = useEvents();

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const getAPIKeys = computed(() => profileUtil.getAPIKeys());

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());

const urlPayload = ref<IURLType>({
  callback_url: getProfileDeveloper.value?.callback_url || "",
  webhook_url: getProfileDeveloper.value?.webhook_url || "",
});

const updateKeysBtnRef = ref<HTMLButtonElement | null>(null);

const payloadValidity = ref<IInputValidity>({
  callback_url: false,
  webhook_url: false,
});

const getKeys = computed(() => {
  // if (getBusinessProfile.value.businessMode === "test") {
  //   return getAPIKeys.value.test;
  // } else return getAPIKeys.value?.live;
  return getAPIKeys.value?.live;
});

const isActionReady = computed(() => {
  return (urlPayload.value.callback_url &&
    payloadValidity.value.callback_url) ||
    (urlPayload.value.webhook_url && payloadValidity.value.webhook_url)
    ? false
    : true;
});

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value },
    bank: { ...getProfileAccount.value },
    contact: { ...getProfileContact.value },
    ...urlPayload.value,
  };
});

const updateProfileAPIKeys = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    btnRef: updateKeysBtnRef,
    btnText: "Update API Keys",
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Developer keys updated successfully",
        type: "success",
      },

      400: {
        message: "Developer keys update failed",
        type: "error",
      },
    },
  });
};

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });
};

watch(
  getProfileDeveloper,
  (newValue) => {
    if (newValue) {
      console.log(newValue);

      urlPayload.value = {
        callback_url: newValue.callback_url || "",
        webhook_url: newValue.webhook_url || "",
      };
    }
  },
  { immediate: true }
);

fetchProfileData();
</script>


<style lang="scss" scoped>
.developer-area {
  @apply flex justify-between items-start sm:flex-col gap-x-4;

  .developer-input {
    @apply w-[48%] sm:w-full;
  }

  .developer-display {
    @apply w-[45%] lg:ml-auto flex justify-end sm:w-full sm:mt-6 sm:block ;

    .help-area {
      @apply w-[310px] h-auto rounded-2xl p-6 text-[15px] sm:w-full sm:block bg-teal-50 border border-grey-100 flex flex-col justify-between items-start gap-y-6;
    }
  }
}
</style>
