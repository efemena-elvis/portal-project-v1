<template>
  <MerchantWrapper
    :title="'Merchant onboarding'"
    :description="'Follow these simple steps to get your merchants onboarded and start to unlock seamless transactions.'"
  >
    <ProgressBar :isActiveStep="isActiveStep" />

    <component
      v-if="currentStep === 0"
      :is="steps[currentStep]"
      :merchantPayload="merchantPayload"
      :payloadValidity="payloadValidity"
      v-model:phoneNumberInput="phoneNumberInput"
      v-model:phoneCountryCode="phoneCountryCode"
      v-model:isPrimaryActionDisabled="isPrimaryActionDisabled"
    />
    <component
      v-else
      :is="steps[currentStep]"
      :merchantPayload="merchantPayload"
      :payloadValidity="payloadValidity"
      v-model:isPrimaryActionDisabled="isPrimaryActionDisabled"
    />

    <div class="flex justify-between">
      <button
        class="btn btn-primary btn-sm my-8 !w-[100px] self-end"
        @click="handlePrevious"
        :disabled="currentStep === 0"
      >
        Previous
      </button>
      <button
        class="btn btn-primary btn-sm my-8 !w-[100px] self-end"
        @click="handleNext"
        :disabled="isPrimaryActionDisabled"
        ref="onboardMerchantBtnRef"
      >
        {{ currentStep === steps.length - 1 ? " Submit" : "Next" }}
      </button>
    </div>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useEvents, useString } from "@packages/hooks";

import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";
import ProgressBar from "../../components/aggregator/onboarding-form-comp.vue/progress-bar.vue";
import MerchantProfile from "../../components/aggregator/onboarding-form-comp.vue/merchant-profile.vue";
import DirectorProfile from "../../components/aggregator/onboarding-form-comp.vue/director-profile.vue";
import UltimateBusinessOwner from "../../components/aggregator/onboarding-form-comp.vue/ultimate-business-owner.vue";
import MerchantDocuments from "../../components/aggregator/onboarding-form-comp.vue/merchant-documents.vue";
import { useAuthStore } from "@/modules/auth/store";
import { useProfile } from "@packages/hooks";
import { countryCurrencies } from "@packages/constants";
import { useGlobalStore } from "@/modules/global/store";
import { onboardMerchant } from "../../store/actions";

interface IPayloadValidity {
  [key: string]: boolean | { [key: string]: boolean } | Array<{ ultimate_business_owner_name: boolean; ultimate_business_owner_address: boolean }>;
  ultimate_business_owner: {
    ultimate_business_owner_name: boolean;
    ultimate_business_owner_address: boolean;
  }[];
}


const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);
const router = useRouter();
const { formatPhoneNumber } = useString();
const { getBusinessCountries, uploadFile } = useGlobalStore();
const { processAPIRequest, pushToastAlert } = useEvents();

const phoneCountryCode = ref<string>("234");
const phoneNumberInput = ref<string>("");
const isPrimaryActionDisabled = ref<boolean>(true);
const isActiveStep = ref("Profile");
const currentStep = ref<number>(0);

const steps = [
  MerchantProfile,
  DirectorProfile,
  UltimateBusinessOwner,
  MerchantDocuments,
];

const user_id = computed(() => {
  return profileUtil?.getUser()?.id;
});

const getCountryName = computed(() => {
  const country = countryCurrencies.find(
    (country) => country.dialing_code === phoneCountryCode.value
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

const payloadValidity = ref<IPayloadValidity>({
  business_name: false,
  email: false,
  phone_number: false,
  website_link: false,
  business_address: false,
  directors_name: false,
  directors_address: false,
  directors_id_document_url: false,
  ultimate_business_owner: [
    {  ultimate_business_owner_name: false,  ultimate_business_owner_address: false }
  ],

  business_certificate_url: false,
  form3_url: false,
});

const merchantPayload = ref({
  user_id: user_id.value,
  business_name: "",
  email: "",
  phone_number: "",
  website_link: "",
  business_address: "",
  directors_name: "",
  directors_address: "",
  directors_id_document_url: "",
  ultimate_business_owner: [
    {  ultimate_business_owner_name: "",  ultimate_business_owner_address: "" }
  ],
  business_certificate_url: "",
  form3_url: "",
});

const getActiveStep = computed(() => {
  switch (currentStep.value) {
    case 0:
      return "Profile";
    case 1:
      return "Director";
    case 2:
      return "UBO";
    default:
      return "Documents";
  }
});

const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleNext = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  } else if (currentStep.value === steps.length - 1) {
    handleOnboardMerchant();
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
    console.log(error);
  }
};

watch(getActiveStep, (newVal) => {
  isActiveStep.value = newVal;
});

watch([phoneNumberInput, phoneCountryCode], () => {
  merchantPayload.value.phone_number = formatPhoneNumber(
    phoneNumberInput.value,
    phoneCountryCode.value
  );
});
</script>

<style scoped lang="scss">
.option-field {
  @apply rounded-lg text-green-500 py-3 px-4 font-semibold cursor-pointer border border-grey-200 w-full flex items-center justify-between;
}
</style>
