<template>
  <ComplianceWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'ComplianceRepresentativeIdentity' })"
    @onContinueClick="handleBankAccountUpdate"
  >
    <SelectFieldInput
      labelId="payoutCurrencies"
      labelTitle="Payout Currency"
      :labelCompact="false"
      inputPlaceholder="Select your payout currency"
      :inputValue="bankCurrency"
      :selectData="getPayoutCurrencies"
      isRequired
      @onSelectionChange="bankCurrency = $event"
    />

    <!-- DYNAMIC FORM FIELDS -->
    <template v-if="isBankAccountLoading">
      <ComplianceSkeleton />
    </template>

    <template v-else>
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
              (val) => updateBusinessPayloadData(field.modelKey, val)
            "
            :errorHandler="field.errorHandler"
          />
        </template>
      </template>
    </template>

    <!-- SKIP ROW -->
    <div class="skip-row">
      Don’t have a business bank account?
      <span @click="router.push({ name: 'ComplianceTerms' })"
        >Skip and update later</span
      >
    </div>
  </ComplianceWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { useComplianceUtil, useProfile } from "@packages/hooks";
import { payoutConfig } from "@packages/constants";
import {
  TextFieldInput,
  SelectFieldInput,
  PhoneFieldInput,
  ComplianceSkeleton,
} from "@packages/uikit";
import { ComplianceWrapper } from "@/modules/compliance/components";
import { useAuthStore } from "@/modules/auth/store";
import { useComplianceStore } from "@/modules/compliance/store";
import { complianceBase } from "@/modules/compliance/store/compliance-base";

const router = useRouter();

const authStore = useAuthStore();
const complianceStore = useComplianceStore();

const { getComplianceBankAccount, getComplianceBusiness } =
  storeToRefs(complianceStore);

const profileUtil = new useProfile(authStore);
const complianceUtil = new useComplianceUtil(complianceStore);

const isBankAccountLoading = ref<boolean>(false);
const stopClickHandler = ref<boolean>(false);
const bankDetailsFields = ref<any[]>([]);
const bankCurrency = ref<string>("");

const businessPayload = ref<Record<string, string>>({});

const phoneCountryCode = ref<string>(
  getComplianceBusiness.value?.phone_number?.split("-")[0] || "234"
);

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const getPayoutCurrencies = computed(() => {
  const currencyList = payoutConfig
    .getAllCurrencies()
    .map((currency) => ({
      value: currency.currency,
      name: `${currency.description} (${currency.currency})`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const localCurrency = currencyList.filter(
    (currency) => currency.value === getLocalCurrencyCode.value
  );

  if (localCurrency.length) {
    bankCurrency.value = localCurrency[0].value;
    return localCurrency;
  }

  // SHOW ALL WALLETS
  else return currencyList;
});

const isActionReady = computed(() => {
  return businessPayload.value.account_holder_name &&
    businessPayload.value.account_number &&
    bankCurrency.value
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

const getBusinessPayload = computed(() => {
  return {
    ...complianceBase.bank_account,
    currency: bankCurrency.value,
    ...businessPayload.value,
  };
});

const handleBankAccountUpdate = async () => {
  await complianceUtil.handleComplianceRequest({
    payload: getBusinessPayload,
    redirectRoute: "ComplianceTerms",
    stopClickHandler,
    succesMsg: "Bank account submitted",
    errorMsg: "Business update failed",
    payloadType: "bank_account",
  });
};

const predefinedBankDetails = () => {};

watch(
  bankCurrency,
  (currency) => {
    if (currency) {
      isBankAccountLoading.value = true;

      const result = payoutConfig.getBankDetailsByCurrency(currency);
      bankDetailsFields.value = payoutConfig.getBankDetailsFields(result);

      setTimeout(() => (isBankAccountLoading.value = false), 700);
    }
  },
  { immediate: true }
);

watch(
  getComplianceBankAccount,
  (newValue) => {
    if (newValue) {
      bankCurrency.value = newValue.currency;
      businessPayload.value = newValue;
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
.skip-row {
  @apply text-sm text-grey-600 mt-8;

  span {
    @apply text-green-600/85 font-semibold cursor-pointer transition duration-300 ease-in-out hover:text-green-500/80;
  }
}
</style>
