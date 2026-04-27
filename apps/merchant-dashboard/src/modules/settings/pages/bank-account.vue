<template>
  <div class="bank-account-area">
    <div class="bank-input">
      <ComplianceSkeleton v-if="isBankAccountLoading" />
      <div v-else>
        <template v-if="bankDetailsFields.length">
          <!-- Ghana Banks -->
          <SelectFieldInput
            v-if="bankCurrency === 'GHS'"
            labelId="bankName"
            labelTitle="Bank Name"
            :labelCompact="false"
            inputPlaceholder="Select your bank name"
            :inputValue="businessPayload?.code"
            :selectData="allBanks"
            isRequired
            @onSelectionChange="selectedBank = $event"
          />
          <div v-else class="mb-6">
            <TextFieldInput
              labelId="bankName"
              labelTitle="Bank Name"
              :labelCompact="false"
              :inputType="IInputType.Text"
              :inputValue="businessPayload?.name"
              inputPlaceholder="Enter your bank name"
              isRequired
              @inputChanged="(val) => updateBusinessPayloadData('name', val)"
            />
            <TextFieldInput
              labelId="bankCode"
              labelTitle="Bank Code"
              :labelCompact="false"
              :inputType="IInputType.Text"
              :inputValue="businessPayload?.code"
              inputPlaceholder="Enter your bank code"
              isRequired
              @inputChanged="(val) => updateBusinessPayloadData('code', val)"
            />
          </div>

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
              class="w-full mt-8 btn btn-primary"
              ref="updateBankBtnRef"
              :disabled="isActionReady"
              @click="updateBankAccount"
            >
              Update Bank Account
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
import { usePaymentStore } from "@/modules/payments/store";
import { useAppVariant } from "@packages/hooks";

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const { fetchUserProfile, updateUserProfile } = useSettingsStore();

const { processAPIRequest } = useEvents();
const profileUtil = new useProfile(authStore);
const { getBanks } = usePaymentStore();

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
const allBanks = ref<any[]>([]);
const selectedBank = ref<{ name: string; code: string } | null>(null);

const defaultCountries = ref<{
  [key: string]: { value: string; name: string };
}>({
  alexpay: { value: "54cf288c-a5b9-4234-8e58-b88ae3457db6", name: "Ghana" },
  redstonepgs: {
    value: "4613642d-4af3-41de-a863-6b8ae84915b9",
    name: "Zambia",
  },
});

const phoneCountryCode = ref<string>("234");
const businessPayload = ref<Record<string, string>>({});
const appVariant = ref<string>(useAppVariant());
const defaultCountry = computed(() => {
  return defaultCountries.value[appVariant.value];
});

const getLocalCurrencyCode = computed(() => {
  const code =
    defaultCountry.value?.name === "Ghana"
      ? "GHS"
      : defaultCountry.value?.name === "Zambia"
        ? "ZMW"
        : "USD";

  const currencyList = payoutConfig
    .getAllCurrencies()
    .filter((currency) => currency.currency === code);

  return {
    ...currencyList[0],
  };
});

// const getBankCurrency = computed(() => {
//   bankCurrency.value = getLocalCurrencyCode.value.currency;
//   return bankCurrency.value;
// });

// const getLocalCurrencyCode = computed(() => {
//   const userProfile = profileUtil.getUser();
//   return userProfile?.country?.currency_code;
// });

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
    getLocalCurrencyCode.value.currency,
  ];
  return currencyList.filter((currency) =>
    deployedWallets.includes(currency.value),
  );
});

const selectedBankDetails = computed(() => {
  const bank = allBanks.value.find((b) => b.value === selectedBank.value);
  return bank ? { name: bank.name, code: bank.value } : null;
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
  payloadValue: string,
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
      payout_currency: bankCurrency.value,
      ...businessPayload.value,
      ...selectedBankDetails.value,
    },
    ...getProfileDeveloper.value,
  };
});

const fetchAllBanks = async () => {
  try {
    const response = await processAPIRequest({
      action: getBanks,
      payload: { country: "GH" },
    });
    if (response && response.code === 200) {
      allBanks.value = response.data.map((bank: any) => ({
        value: bank.code,
        name: bank.name,
      }));
    } else {
      console.error("Failed to fetch banks:", response);
      allBanks.value = [];
    }
  } catch (err) {
    console.error("Failed to fetch banks:", err);
    allBanks.value = [];
  }
};

const updateBankAccount = async () => {
  const response = await processAPIRequest({
    action: updateUserProfile,
    btnRef: updateBankBtnRef,
    btnText: "Update Bank Account",
    payload: getPayload.value,
    alertHandler: {
      200: {
        message: "Bank account updated successfully",
        type: "success",
      },
      400: {
        message: "Bank account update failed",
        type: "error",
      },
    },
  });
};

watch(
  bankCurrency,
  async (currency) => {
    if (currency) {
      isBankAccountLoading.value = true;
      const result = payoutConfig.getBankDetailsByCurrency(currency);
      bankDetailsFields.value = payoutConfig.getBankDetailsFields(result);

      if (currency === "GHS") {
        await fetchAllBanks();
      }

      setTimeout(() => (isBankAccountLoading.value = false), 700);
    }
  },
  { immediate: true },
);

// Fetch all profile data
const fetchProfileData = async () => {
  const response = await processAPIRequest({
    action: fetchUserProfile,
    showAlert: false,
  });
  return response;
};

watch(
  getProfileAccount,
  (newValue) => {
    if (newValue) {
      businessPayload.value = {
        name: newValue.name,
        code: newValue.code,
        account_number: newValue.account_number,
        account_holder_name: newValue.account_holder_name,
      };
    }
  },
  { immediate: true, deep: true },
);

onMounted(async () => {
  await fetchProfileData();
  bankCurrency.value = getLocalCurrencyCode.value.currency;
});
</script>

<style lang="scss" scoped>
.bank-account-area {
  @apply flex justify-between items-start gap-x-4;

  .bank-input {
    @apply w-[48%] sm:w-full;
  }
}
</style>
