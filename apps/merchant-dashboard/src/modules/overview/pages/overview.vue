<template>
  <PageContentWrapper>
    <template v-slot:pageContent>
      <!-- OVERFLOW ROW -->
      <div class="overflow-row">
        <OverviewCard
          v-for="(wallet, index) in walletBalance"
          :key="index"
          :wallet="wallet"
        />
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
import { useProfile, useEvents } from "@packages/hooks";
import { storeToRefs } from "pinia";
import { OverviewCard, TransactionTable } from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";

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

const { getWallets, updateWalletState } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);

const { processAPIRequest } = useEvents();

const walletBalance = ref<IWalletBalance[]>([]);

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const loadLocalCountryCurrency = () => {
  const localCountryPayload = countryCurrencies.find(
    (country) => country.currency.short === getLocalCurrencyCode.value
  );

  walletBalance.value = [
    {
      countryFlag: localCountryPayload?.flag ?? "",
      description: localCountryPayload?.currency.description ?? "",
      currencyShort: localCountryPayload?.currency.short ?? "",
      currencySign: localCountryPayload?.currency.sign ?? "",
      amount: 0,
    },
  ];
};

const fetchAllWallets = async () => {
  if (getAllWallets?.value?.walletBalance.length === 0) {
    loadLocalCountryCurrency();
  } else {
    walletBalance.value = getAllWallets.value.walletBalance;
  }

  const response = await processAPIRequest({
    action: getWallets,
    showAlert: false,
  });

  if (response?.code === 200) {
    // GET LOCAL WALLET BALANCES
    const localWallet = response.data.find(
      (wallet: any) => wallet.currency === getLocalCurrencyCode.value
    );

    walletBalance.value[0].amount = localWallet?.market_balance ?? 0;

    // LOAD OTHER CURRENCIES BALANCE
    const nonLocalWallets = response.data.filter(
      (wallet: any) =>
        wallet.currency !== getLocalCurrencyCode.value &&
        wallet.currency !== "USD"
    );

    nonLocalWallets.forEach((wallet: any) => {
      const walletCurrencyData = countryCurrencies.find(
        (country) => country.currency.short === wallet.currency
      );

      const walletPayload: IWalletBalance = {
        countryFlag: walletCurrencyData?.flag ?? "",
        description: walletCurrencyData?.currency.description ?? "",
        currencyShort: walletCurrencyData?.currency.short ?? "",
        currencySign: walletCurrencyData?.currency.sign ?? "",
        amount: wallet?.market_balance ?? 0,
      };

      const taxWalletPayload: ITaxBalance = {
        countryFlag: walletCurrencyData?.flag ?? "",
        currencyShort: walletCurrencyData?.currency.short ?? "",
        currencySign: walletCurrencyData?.currency.sign ?? "",
        amount: wallet?.tax_balance ?? 0,
      };

      // Replace or push for walletBalance
      const existingWalletIndex = walletBalance.value.findIndex(
        (entry) => entry.currencyShort === walletPayload.currencyShort
      );

      if (existingWalletIndex !== -1) {
        walletBalance.value[existingWalletIndex] = walletPayload;
      } else {
        walletBalance.value.push(walletPayload);
      }
    });

    // UPDATE LOCAL WALLET STATE
    updateWalletState({
      walletBalance: walletBalance.value,
    });
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
