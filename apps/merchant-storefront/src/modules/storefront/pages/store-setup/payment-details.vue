<template>
  <StorefrontSetupWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'SetupContactDetails' })"
    @onContinueClick="handlePaymentDetails"
  >
    <template v-if="bankDetailsFields.length">
      <template v-for="field in bankDetailsFields" :key="field.labelId">
        <TextFieldInput
          v-if="field.inputType !== 'Phone'"
          :labelId="field.labelId"
          :labelTitle="field.labelTitle"
          :labelCompact="false"
          :inputType="
            field.inputType === 'Text' ? IInputType.Text : IInputType.Number
          "
          :inputValue="businessPayload[field.modelKey]"
          :inputPlaceholder="field.inputPlaceholder"
          :isRequired="field.isRequired"
          @inputChanged="
            (val) => updateBusinessPayloadData(field.modelKey, val)
          "
          :errorHandler="field.errorHandler"
        />

        <PhoneFieldInput
          v-else
          :labelId="field.labelId"
          :labelTitle="field.labelTitle"
          :labelCompact="false"
          :inputPlaceholder="field.inputPlaceholder"
          :inputValue="businessPayload[field.modelKey]"
          :isRequired="field.isRequired"
          :activeCountryCode="phoneCountryCode"
          @countryCodeChanged="phoneCountryCode = $event"
          @inputChanged="
            (val: any) => updateBusinessPayloadData(field.modelKey, val)
          "
          :errorHandler="field.errorHandler"
        />
      </template>
    </template>
  </StorefrontSetupWrapper>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { IInputType } from "@packages/models";
import { TextFieldInput } from "@packages/uikit";
import { payoutConfig } from "@packages/constants";
import StorefrontSetupWrapper from "@/modules/storefront/components/storefront-setup-wrapper.vue";

const router = useRouter();
const stopClickHandler = ref<boolean>(false);

const businessPayload = ref<Record<string, string>>({});
const phoneCountryCode = ref<string>("260");
const bankCurrency = ref<string>("ZMW");

const bankDetailsFields = computed(() => {
  const result = payoutConfig.getBankDetailsByCurrency(bankCurrency.value);
  return payoutConfig.getBankDetailsFields(result);
});

const isActionReady = computed(() => {
  return businessPayload.value.account_holder_name &&
    businessPayload.value.account_number &&
    businessPayload.value.bank_name &&
    businessPayload.value.branch_code
    ? false
    : true;
});

const updateBusinessPayloadData = (
  payloadKey: string,
  payloadValue: string
) => {
  businessPayload.value = {
    ...businessPayload.value,
    [payloadKey]: payloadValue,
  };
};

const handlePaymentDetails = () => {
  router.push({ name: "SetupIdentificationDetails" });
};
</script>
