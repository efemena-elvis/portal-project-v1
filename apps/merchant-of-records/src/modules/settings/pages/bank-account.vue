<template>
  <div class="bank-account-area">
    <div class="bank-input">
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
          <div class="mb-12">
            <template v-for="field in bankDetailsFields" :key="field.labelId">
              <TextFieldInput
                v-if="field.inputType !== 'Phone'"
                :labelId="field.labelId"
                :labelTitle="field.labelTitle"
                :labelCompact="false"
                :inputType="
                  field.inputType === 'Text'
                    ? IInputType.Text
                    : IInputType.Number
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

            <button
              class="btn btn-primary w-full mt-8"
              ref="updateBankBtnRef"
              :disabled="isActionReady"
              @click="updateBankAccount"
            >
              Update Bank Account
            </button>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { payoutConfig } from "@packages/constants";
import { useEvents, useProfile } from "@packages/hooks";
import {
  TextFieldInput,
  SelectFieldInput,
  PhoneFieldInput,
  ComplianceSkeleton,
} from "@packages/uikit";
import { useAuthStore } from "@/modules/auth/store";
import { useSettingsStore } from "@/modules/settings/store";
import { useOverviewStore } from "@/modules/overview/store";

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const { fetchUserProfile, updateUserProfile } = useSettingsStore();

const { processAPIRequest } = useEvents();
const profileUtil = new useProfile(authStore);

const {
  getProfileDetails,
  getProfileAccount,
  getProfileContact,
  getProfileDeveloper,
} = storeToRefs(useSettingsStore());
const { getAllWallets } = storeToRefs(overviewStore);

const updateBankBtnRef = ref<HTMLButtonElement | null>(null);

const isBankAccountLoading = ref<boolean>(false);
const bankDetailsFields = ref<any[]>([]);
const bankCurrency = ref<string>("");

const phoneCountryCode = ref<string>("234");
const businessPayload = ref<Record<string, string>>({});

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

  const deployedWallets = [
    ...getAllWallets.value?.walletBalance.map((wallet) => wallet.currencyShort),
    getLocalCurrencyCode.value,
  ];

  return currencyList.filter((currency) =>
    deployedWallets.includes(currency.value)
  );
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

const getPayload = computed(() => {
  return {
    profile: { ...getProfileDetails.value },
    contact: { ...getProfileContact.value },
    bank: {
      ...getProfileAccount.value,
      currency: bankCurrency.value,
      ...businessPayload.value,
    },
    ...getProfileDeveloper.value,
  };
});

const updateProfileAPIKeys = async () => {
  // const response = await processAPIRequest({
  //   action: updateUserProfile,
  //   btnRef: updateBankBtnRef,
  //   btnText: "Update Bank Account",
  //   payload: getPayload.value,
  //   alertHandler: {
  //     200: {
  //       message: "Bank account updated successfully",
  //       type: "success",
  //     },
  //     400: {
  //       message: "Bank account update failed",
  //       type: "error",
  //     },
  //   },
  // });
};

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

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });
};

watch(
  getProfileAccount,
  (newValue) => {
    if (newValue) {
      console.log(newValue);
    }
  },
  { immediate: true }
);

fetchProfileData();
</script>

<style lang="scss" scoped>
.bank-account-area {
  @apply flex justify-between items-start gap-x-4;

  .bank-input {
    @apply w-[48%] sm:w-full;
  }
}
</style>
