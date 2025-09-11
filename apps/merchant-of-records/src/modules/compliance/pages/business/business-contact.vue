<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceBusinessProfile' })"
    @onContinueClick="handleBusinessContactUpdate"
  >
    <TextFieldInput
      labelId="businessEmailAddress"
      labelTitle="Business Email Address"
      :labelCompact="false"
      :inputType="IInputType.Email"
      :inputValue="businessPayload.email"
      inputPlaceholder="Provide a business email address"
      :isRequired="true"
      :isDisabled="true"
      @inputChanged="businessPayload.email = $event"
      @inputValidated="payloadValidity.email = $event"
      :errorHandler="{
        validator: 'validateEmail',
      }"
    />

    <PhoneFieldInput
      labelId="businessPhoneNumber"
      labelTitle="Phone Number"
      :labelCompact="false"
      :inputValue="businessPayload.phone_number"
      inputPlaceholder="Provide a business phone number"
      :isRequired="true"
      :activeCountryCode="phoneCountryCode"
      @countryCodeChanged="phoneCountryCode = $event"
      @inputChanged="businessPayload.phone_number = $event"
      @inputValidated="payloadValidity.phone_number = $event"
      :errorHandler="{
        validator: 'validatePhone',
      }"
    />

    <TextFieldInput
      labelId="businessWebsite"
      labelTitle="Business Website"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.website"
      inputPlaceholder="Provide a business website url"
      :isRequired="false"
      @inputChanged="businessPayload.website = $event"
    />
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { useString, useComplianceUtil, useProfile } from "@packages/hooks";
import { TextFieldInput, PhoneFieldInput } from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import { useAuthStore } from "@/modules/auth/store";

type IBusinessType = {
  email: string;
  phone_number: string;
  website?: string;
};

type IInputValidity = {
  email: boolean;
  phone_number: boolean;
};

const router = useRouter();
const { formatPhoneNumber } = useString();

const authStore = useAuthStore();
const complianceStore = useComplianceStore();

const profileUtil = new useProfile(authStore);
const complianceUtil = new useComplianceUtil(complianceStore);

const { getComplianceBusiness } = storeToRefs(complianceStore);
const getUserProfile = computed(() => profileUtil.getUser());

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  email: getUserProfile?.value?.email || "",
  phone_number: getComplianceBusiness.value?.phone_number?.split("-")[1] || "",
  website: getComplianceBusiness.value?.website || "",
});

const payloadValidity = ref<IInputValidity>({
  email: false,
  phone_number: false,
});

const phoneCountryCode = ref<string>(
  getComplianceBusiness.value?.phone_number?.split("-")[0] || "234"
);

const isActionReady = computed(() => {
  return businessPayload.value.email &&
    businessPayload.value.phone_number &&
    businessPayload.value.website &&
    payloadValidity.value.email &&
    payloadValidity.value.phone_number
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { email, phone_number, website } = businessPayload.value;
  return {
    email,
    phone_number: formatPhoneNumber(phone_number, phoneCountryCode.value),
    website,
  };
});

const handleBusinessContactUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceBusinessAddress",
    stopClickHandler,
    succesMsg: "Business contact submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        email: getUserProfile?.value?.email || newValue.email || "",
        phone_number: newValue.phone_number?.split("-")[1] || "",
        website: newValue.website || "",
      };

      phoneCountryCode.value = newValue.phone_number?.split("-")[0] || "234";
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
