<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- OVERFLOW ROW -->
      <div class="overflow-row">
        <OverviewCard :wallet="walletBalance" />
      </div>

      <!-- TRANSACTION ROW -->
      <div class="transaction-row">
        <TransactionTable />
      </div>
    </template>
  </PageContentWrapper>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { countryCurrencies } from "@packages/constants";
import { PageContentWrapper } from "@packages/uikit";
import { useProfile, useEvents, useAppVariant } from "@packages/hooks";
import { storeToRefs } from "pinia";
import { OverviewCard, TransactionTable } from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";
import { get } from "http";

interface IWalletBalance {
  countryFlag: string;
  description: string;
  currencyShort: string;
  currencySign: string;
  amount: number;
}
interface ITaxBalance {
  countryFlag: string;
  currencyShort: string;
  currencySign: string;
  amount: number;
}

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const profileUtil = new useProfile(authStore);
const appVariant = ref<string>(useAppVariant());
const localCountryPayload = ref<any>(null);

const { getWallets, updateWalletState } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);

const { processAPIRequest } = useEvents();

const walletBalance = ref<IWalletBalance[] | IWalletBalance | undefined>(
  undefined
);

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const loadLocalCountryCurrency = () => {
  if (appVariant.value === "alexpay") {
    localCountryPayload.value = countryCurrencies.find(
      (country) => country.currency.short === "GHS"
    );
  } else {
    localCountryPayload.value = countryCurrencies.find(
      (country) => country.currency.short === "ZMW"
    );
  }

  walletBalance.value = {
    countryFlag: localCountryPayload.value?.flag ?? "",
    description: localCountryPayload.value?.currency.description ?? "",
    currencyShort: localCountryPayload.value?.currency.short ?? "",
    currencySign: localCountryPayload.value?.currency.sign ?? "",
    amount: 0,
  };
};

const fetchAllWallets = async () => {
  loadLocalCountryCurrency();

  const response = await processAPIRequest({
    action: getWallets,
    showAlert: false,
  });

  if (response?.code === 200) {
    const localWallet = response.data.find(
      (wallet: any) =>
        wallet.country.currency_code === getLocalCurrencyCode.value
    );

    if (localWallet) {
      walletBalance.value = {
        countryFlag: localCountryPayload.value?.flag ?? "",
        description: localWallet?.country.name ?? "",
        currencyShort: localCountryPayload.value?.currency.short ?? "",
        currencySign: localCountryPayload.value?.currency.sign ?? "",
        amount: localWallet?.balance ?? 0,
      };
    }
  }
};

onMounted(() => fetchAllWallets());
</script>

<style lang="scss" scoped>
.button-row {
  .btn-sm {
    @apply py-0.5 px-5 h-[46px] gap-x-1 font-semibold sm:mt-12;
  }
}

.overflow-row {
  @apply flex justify-start items-center gap-8 mb-9;
}

.tax-row {
  @apply flex justify-between items-center gap-8 mb-9;

  &--left {
    @apply w-1/2;
  }

  &--right {
    @apply w-1/2;
  }
}
</style>
