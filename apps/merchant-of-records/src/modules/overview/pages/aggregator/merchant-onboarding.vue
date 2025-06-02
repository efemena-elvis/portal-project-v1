<template>
  <div class="flex gap-8 p-12">
    <ProgressBar
      :isActiveStep="isActiveStep"
      @stepChanged="onStepChange"
      :steps="stepList"
    />
    <div class="w-full relative">
      <div class="pl-5 text-teal-700">
        <h1 class="font-semibold text-[28px] md:text-2xl leading-[32px] mb-2.5">
          Merchant Onboarding
        </h1>
        <p
          class="text-[14.75px] md:text-[14.5px] leading-[22px] md:leading-[22px] mb-4"
        >
          Follow these simple steps to get your merchants onboarded and start to
          unlock seamless transactions.
        </p>
      </div>
      <component
        :is="steps[currentStep]"
        v-model:merchantPayload="merchantPayload"
        v-model:isPrimaryActionDisabled="isPrimaryActionDisabled"
        v-if="currentStep === 0"
        v-model:phoneNumberInput="phoneNumberInput"
        v-model:phoneCountryCode="phoneCountryCode"
      />
      <component
        v-else
        :is="steps[currentStep]"
        v-model:merchantPayload="merchantPayload"
        v-model:isPrimaryActionDisabled="isPrimaryActionDisabled"
      />

      <div class="absolute right-6">
        <button
          @click="handleOnboardMerchant"
          class="btn btn-primary btn-sm my-8 !w-[150px]"
          v-if="currentStep === steps.length - 1"
          ref="onboardMerchantBtnRef"
        >
          Onboard Merchants
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useEvents, useString, useProfile } from "@packages/hooks";
import { countryCurrencies } from "@packages/constants";

import ProgressBar from "../../components/aggregator/onboarding-form-comp/progress-bar.vue";
import BusinessProfile from "../../components/aggregator/onboarding-form-comp/business-profile.vue";
import BusinessAddress from "../../components/aggregator/onboarding-form-comp/business-address.vue";
import DirectorProfile from "../../components/aggregator/onboarding-form-comp/director-profile.vue";
import UltimateBusinessOwner from "../../components/aggregator/onboarding-form-comp/ultimate-business-owner.vue";
import BusinessDocuments from "../../components/aggregator/onboarding-form-comp/business-documents.vue";

import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";
import { onboardMerchant } from "../../store/actions";

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);
const router = useRouter();
const { formatPhoneNumber } = useString();
const { getBusinessCountries, uploadFile } = useGlobalStore();
const { processAPIRequest, pushToastAlert } = useEvents();

const phoneCountryCode = ref("234");
const phoneNumberInput = ref("");
const isPrimaryActionDisabled = ref(true);
const isActiveStep = ref("Profile");
const currentStep = ref(0);

const steps = [
  BusinessProfile,
  BusinessAddress,
  DirectorProfile,
  DirectorProfile,
  UltimateBusinessOwner,
  UltimateBusinessOwner,
  BusinessDocuments,
];

const user_id = computed(() => profileUtil.getUser()?.id);

const getCountryName = computed(() => {
  const country = countryCurrencies.find(
    (item) => item.dialing_code === phoneCountryCode.value
  );
  return country?.country || "Nigeria";
});

const fetchSingleCountryUUID = async (): Promise<string> => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    payload: {},
  });

  if (response.code === 200) {
    const country = response.data.find(
      (item: { name: string }) =>
        item.name.trim().toLowerCase() ===
        getCountryName.value.trim().toLowerCase()
    );
    return country?.id || "";
  }

  return "";
};

const onboardMerchantBtnRef = ref(null);

const merchantPayload = ref([
  {
    id: Math.floor(Math.random() * 1000000),
    business_name: "",
    business_sector: "",
    email: "",
    phone_number: "",
    website: "",
  },
]);

const stepList = ref([
  { step: 1, label: "Profile" },
  { step: 2, label: "Address" },
  { step: 3, label: "Director 1" },
  { step: 4, label: "Director 2" },
  { step: 4, label: "Ultimate Business Owner 1" },
  { step: 6, label: "Ultimate Business Owner 2" },
  { step: 7, label: "Business Documents" },
]);

const onStepChange = (label: string) => {
  const index = stepList.value.findIndex((step) => step.label === label);
  if (index !== -1) {
    currentStep.value = index;
  }
};



const handleOnboardMerchant = async () => {
  const country_id = await fetchSingleCountryUUID();
  const payload = {
    ...merchantPayload.value,
    country_id,
  };

  try {
    const response = await processAPIRequest({
      action: onboardMerchant,
      btnRef: onboardMerchantBtnRef,
      btnText: "Next",
      payload,
      showAlert: true,
    });

    if (response.code === 201) {
      pushToastAlert({
        message: "Merchant onboarded successfully.",
        type: "success",
      });
      router.push("/merchant/add-merchant-status");
    } else {
      pushToastAlert({
        message: response.error.message,
        type: "error",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

watch(currentStep, (newVal) => {
  isActiveStep.value = stepList.value[newVal]?.label || "";
});


</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg text-green-500 py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
