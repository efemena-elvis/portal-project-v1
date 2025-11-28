<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceBusinessContact' })"
    @onContinueClick="handleBusinessAddressUpdate"
  >
    <TextFieldInput
      labelId="businessAddress"
      labelTitle="Business Address"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.first_address"
      inputPlaceholder="Provide your business address"
      :isRequired="true"
      @inputChanged="businessPayload.first_address = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business address is a required field',
      }"
    />

    <TextFieldInput
      labelId="businessState"
      labelTitle="Business State / Province"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.state"
      inputPlaceholder="Which state is your business located?"
      :isRequired="true"
      @inputChanged="businessPayload.state = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business state is a required field',
      }"
    />

    <TextFieldInput
      labelId="businessCity"
      labelTitle="Business City"
      :labelCompact="false"
      :inputType="IInputType.Text"
      :inputValue="businessPayload.city"
      inputPlaceholder="What's your city of operation?"
      :isRequired="true"
      @inputChanged="businessPayload.city = $event"
      :errorHandler="{
        validator: 'validateRequired',
        message: 'Business city is a required field',
      }"
    />
      <div class="text-neutral-500 font-semibold mt-4 text-sm">
        <span>Address not available? </span>
        <button @click="router.push({ name: 'ComplianceBusinessVerification' })" class="text-green-500">Skip</button>
      </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { TextFieldInput } from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useComplianceStore } from "@/modules/compliance/store";
import { useComplianceUtil } from "@packages/hooks";

type IBusinessType = {
  first_address: string;
  state: string;
  city: string;
};

const router = useRouter();

const complianceStore = useComplianceStore();
const complianceUtil = new useComplianceUtil(complianceStore);

const { getComplianceBusiness } = storeToRefs(complianceStore);

const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<IBusinessType>({
  first_address: "",
  state: "",
  city: "",
});

const isActionReady = computed(() => {
  return businessPayload.value.first_address &&
    businessPayload.value.city &&
    businessPayload.value.state
    ? false
    : true;
});

const getBusinessPayload = computed(() => {
  const { first_address, city, state } = businessPayload.value;
  return { first_address, city, state };
});

const handleBusinessAddressUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload.value,
    redirectRoute: "ComplianceBusinessVerification",
    stopClickHandler,
    successMsg: "Business address submitted",
    errorMsg: "Business update failed",
    payloadType: "business",
  });
};

watch(
  getComplianceBusiness,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        first_address: newValue.first_address || "",
        city: newValue.city || "",
        state: newValue.state || "",
      };
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped></style>
