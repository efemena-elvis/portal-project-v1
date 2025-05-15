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
      >
        Next
      </button>
    </div>
  </MerchantWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useString } from "@packages/hooks";

import MerchantWrapper from "../../components/aggregator/merchant-wrapper.vue";
import ProgressBar from "../../components/aggregator/onboarding-form-comp.vue/progress-bar.vue";
import MerchantProfile from "../../components/aggregator/onboarding-form-comp.vue/merchant-profile.vue";
import DirectorProfile from "../../components/aggregator/onboarding-form-comp.vue/director-profile.vue";
import UltimateBusinessOwner from "../../components/aggregator/onboarding-form-comp.vue/ultimate-business-owner.vue";
import MerchantDocuments from "../../components/aggregator/onboarding-form-comp.vue/merchant-documents.vue";

interface IPayloadValidity {
  [key: string]: boolean;
}

const router = useRouter();
const { formatPhoneNumber } = useString();

const phoneCountryCode = ref<string>("234");
const phoneNumberInput = ref<string>("");

// ✅ Correct type: boolean
const isPrimaryActionDisabled = ref<boolean>(true);
const isActiveStep = ref("Profile");
const currentStep = ref<number>(0);

const steps = [
  MerchantProfile,
  DirectorProfile,
  UltimateBusinessOwner,
  MerchantDocuments,
];

const payloadValidity = ref<IPayloadValidity>({
  business_name: false,
  business_email: false,
  phone_number: false,
  website_link: false,
  business_address: false,
  director_name: false,
  director_address: false,
  director_identity_verification: false,
  ultimate_business_owner_name: false,
  ultimate_business_owner_address: false,
  ultimate_business_owner_name_2: false,
  ultimate_business_owner_address_2: false,
  business_certificate: false,
  form_3: false,
});

const merchantPayload = ref({
  business_name: "",
  business_email: "",
  phone_number: "",
  website_link: "",
  business_address: "",
  director_name: "",
  director_address: "",
  director_identity_verification: "",
  ultimate_business_owner_name: "",
  ultimate_business_owner_address: "",
  ultimate_business_owner_name_2: "",
  ultimate_business_owner_address_2: "",
  business_certificate: "",
  form_3: "",
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
  } else {
    router.push("/merchants/add-merchant-status");
  }
  console.log(merchantPayload.value);
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
