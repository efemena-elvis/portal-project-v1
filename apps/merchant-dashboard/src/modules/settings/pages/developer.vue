<template>
  <div class="developer-area" >
    <ComplianceSkeleton v-if="isLoading"/>
 

    <div class="developer-input" v-else>
      <div class="input-form mb-7">
        <TextFieldInput
          labelId="textSecretKey"
          :labelTitle="
            getBusinessMode === `test` ? 'Test Secret Key' : 'Live Secret Key'
          "
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
          :labelTitle="
            getBusinessMode === `test` ? 'Test Public Key' : 'Live Public Key'
          "
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
          :labelTitle="
            getBusinessMode === `test`
              ? 'Test Callback URL'
              : 'Live Callback URL'
          "
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
          :labelTitle="
            getBusinessMode === `test` ? 'Test Webhook URL' : 'Live Webhook URL'
          "
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

      <!-- Button to toggle CDN usage display -->
      <button
        class="w-full mt-4 btn btn-tertiary"
        @click="showCDNUsage = !showCDNUsage"
      >
        {{
          showCDNUsage
            ? "Hide Embedded Payment Usage"
            : "Show Embedded Payment Usage"
        }}
      </button>
    </div>

    <div class="flex flex-col gap-4 w-full">
      <EmbeddedPaySnippet v-if="showCDNUsage" />
      <div class="developer-display">
        <div class="help-area">
          <div class="body-text text-grey-900">
            Need help integrating our APIs on your platform?
          </div>
          <button
            class="btn btn-sm btn-tertiary sm:mt-4"
            @click="accessMerchantDeveloperAPI"
          >
            Explore our APIs
          </button>
        </div>
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
import {
  useEvents,
  useProfile,
  useAppVariant,
  useString,
} from "@packages/hooks";
import { TextFieldInput, ComplianceSkeleton } from "@packages/uikit";
import { EmbeddedPaySnippet } from "@/modules/payments/components";

type IURLType = {
  callback_url: string;
  webhook_url: string;
};

type IInputValidity = {
  callback_url: boolean;
  webhook_url: boolean;
};

const appVariant = ref<string>(useAppVariant());

const { createAndClickAnchor } = useString();

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
  callback_url: "",
  webhook_url: "",
});

const updateKeysBtnRef = ref<HTMLButtonElement | null>(null);
const showCDNUsage = ref<boolean>(false);

const payloadValidity = ref<IInputValidity>({
  callback_url: false,
  webhook_url: false,
});

const isLoading = ref<boolean>(false);

const getKeys = computed(() => {
  if (getBusinessProfile?.value?.businessMode === "test") {
    return getAPIKeys.value.test;
  } else return getAPIKeys.value?.live;
});

const getBusinessMode = computed(() => {
  return getBusinessProfile.value?.businessMode || "test";
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

const accessMerchantDeveloperAPI = () => {
  const developerAPI: { [key: string]: string } = {
    redstonepgs: "https://developer.redstonepgs.com",
    alexpay: "https://developer.alexpay.com",
  };

  return createAndClickAnchor(developerAPI[appVariant.value], "_blank");
};

const updateProfileAPIKeys = async () => {
  await processAPIRequest({
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
  isLoading.value = true;

  await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });

  const developer = getProfileDeveloper.value;
  if (developer) {
    urlPayload.value = { ...developer };
  }

  isLoading.value = false;
};

watch(
  getProfileDeveloper,
  (newValue) => {
    if (newValue) {
      urlPayload.value = {
        callback_url: newValue.callback_url || "",
        webhook_url: newValue.webhook_url || "",
      };

      // publishableKey.value = newValue.publishable_key || "";
    }
  },
  { immediate: true },
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
    @apply w-[45%] lg:ml-auto flex justify-end sm:w-full sm:mt-6 sm:block;

    .help-area {
      @apply w-[310px] h-auto rounded-2xl p-6 text-[15px] sm:w-full sm:block bg-teal-50 border border-grey-100 flex flex-col justify-between items-start gap-y-6;
    }
  }
}
</style>
