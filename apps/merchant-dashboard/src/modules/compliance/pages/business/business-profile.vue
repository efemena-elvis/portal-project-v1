<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'VesicashOverview' })"
    @onContinueClick="handleBusinessProfileUpdate"
  >
    <TextFieldInput
      labelId="businessName"
      labelTitle="Legal Business Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.legal_name"
      inputPlaceholder="Provide registered business name"
      :isRequired="true"
      :isDisabled="true"
      @inputChanged="businessPayload.legal_name = $event"
      @inputValidated="payloadValidity.legal_name = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Legal business name is a required field',
      }"
    />

    <TextFieldInput
      labelId="tradingName"
      labelTitle="Trading Name"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.trading_name"
      inputPlaceholder="Provide a commonly known business name"
      :isRequired="true"
      @inputChanged="businessPayload.trading_name = $event"
      @inputValidated="payloadValidity.trading_name = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Trading name is a required field',
      }"
    />

    <SelectFieldInput
      labelId="businessSector"
      labelTitle="Business Sector"
      :labelCompact="false"
      inputPlaceholder="Select business sector"
      :inputValue="businessPayload.sector"
      :selectData="businessSectors"
      isRequired
      @onSelectionChange="businessPayload.sector = $event"
    />
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { useProfile, useComplianceUtil } from "@packages/hooks";
import { TextFieldInput, SelectFieldInput } from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import businessSectors from "@/modules/compliance/constants/business-sectors";
import { useComplianceStore } from "@/modules/compliance/store";
import { useAuthStore } from "@/modules/auth/store";

type IBusinessType = {
  legal_name: string;
  trading_name: string;
  sector: string;
};

type IInputValidity = {
  legal_name: boolean;
  trading_name: boolean;
  sector: boolean;
};

const router = useRouter();

const authStore = useAuthStore();
const complianceStore = useComplianceStore();

const profileUtil = new useProfile(authStore);
const complianceUtil = new useComplianceUtil(complianceStore);

const getBusinessProfile = computed(() => profileUtil.getBusiness());
const { getComplianceBusiness } = storeToRefs(complianceStore);

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  legal_name: getBusinessProfile?.value?.businessName || "",
  trading_name:
    getComplianceBusiness.value?.trading_name ||
    getBusinessProfile?.value?.businessName ||
    "",
  sector: getComplianceBusiness.value?.sector || "",
});

const payloadValidity = ref<IInputValidity>({
  legal_name: false,
  trading_name: false,
  sector: false,
});

const isActionReady = computed(() => {
  return businessPayload.value.legal_name &&
    businessPayload.value.trading_name &&
    businessPayload.value.sector
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { legal_name, trading_name, sector } = businessPayload.value;
  return {
    legal_name,
    trading_name,
    sector,
  };
});

const handleBusinessProfileUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceBusinessContact",
    stopClickHandler,
    succesMsg: "Business profile submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        legal_name: getBusinessProfile?.value?.businessName || "",
        trading_name:
          newValue.trading_name || getBusinessProfile.value?.businessName || "",
        sector: newValue.sector || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
