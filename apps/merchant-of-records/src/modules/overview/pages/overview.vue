<template>
  <PageContentWrapper>
    <template v-slot:pageOptions>
      <div class="button-row">
        <router-link
          :to="
            morAccountType === 'aggregator'
              ? '/aggregator-merchant/business-profile'
              : '/market/wallet-entry'
          "
          class="btn btn-primary hover:text-white"
        >
          {{ morAccountType === "aggregator" ? "+ Add merchants" : "Expand" }}
        </router-link>
      </div>
    </template>
    <template v-slot:pageContent>
      <!-- OVERFLOW ROW -->
      <template v-if="morAccountType === 'aggregator'">
        <AggregatorMetrics />
      </template>

      <!-- <template v-else>
        <div class="overflow-row">
          <OverviewCard
            v-for="(wallet, index) in walletBalance"
            :key="index"
            :wallet="wallet"
          />
        </div>
      </template> -->

      <!-- TAX ROW -->
      <!-- <template v-if="morAccountType === 'aggregator'">
        <AggregatorCharts />
      </template> -->

      <template v-if="morAccountType !== 'aggregator'">
        <div class="tax-row">
          <div class="tax-row--left">
            <TaxBlock :taxList="taxBalance" />
          </div>

          <div class="tax-row--right">
            <TransactionMetrics  :transactionStats="transactionStats"/>
          </div>
        </div>
      </template>

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
import {
  OverviewCard,
  TaxBlock,
  TransactionMetrics,
  TransactionTable,
  AggregatorMetrics,
  AggregatorCharts,
} from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";
import { useBalanceStore } from "@/modules/balances/store";

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
const {getTransactionStats} = useBalanceStore()

const { processAPIRequest } = useEvents();

const walletBalance = ref<IWalletBalance[]>([]);
const taxBalance = ref<ITaxBalance[]>([]);
const transactionStats = ref<any>({});

const morAccountType = computed(() => {
  const userProfile = profileUtil?.getUser();
  return userProfile?.morAccountType;
});

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

  taxBalance.value = [
    {
      countryFlag: localCountryPayload?.flag ?? "",
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
    taxBalance.value = getAllWallets.value.taxBalance;
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
    taxBalance.value[0].amount = localWallet?.tax_balance ?? 0;

    // LOAD OTHER CURRENCIES BALANCE
    // const nonLocalWallets = response.data.filter(
    //   (wallet: any) =>
    //     wallet.currency !== getLocalCurrencyCode.value &&
    //     wallet.currency !== "USD"
    // );
    const nonLocalWallets = response.data.filter(
      (wallet: any) => wallet.currency !== getLocalCurrencyCode.value
    );

    nonLocalWallets.forEach((wallet: any) => {
      // console.log("Processing wallet:", wallet);
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

      // Replace or push for taxBalance
      const existingTaxIndex = taxBalance.value.findIndex(
        (entry) => entry.currencyShort === taxWalletPayload.currencyShort
      );

      if (existingTaxIndex !== -1) {
        taxBalance.value[existingTaxIndex] = taxWalletPayload;
      } else {
        taxBalance.value.push(taxWalletPayload);
      }
    });

    // UPDATE LOCAL WALLET STATE
    updateWalletState({
      walletBalance: walletBalance.value,
      taxBalance: taxBalance.value,
    });
  }
};

const fetchTransactionStats = async () => {
  const response = await processAPIRequest({
    action: getTransactionStats,
    payload: {},
    showAlert: false,
  });

  if (response.code === 200) {
    transactionStats.value = response.data;
  }
};

onMounted(() => {
  fetchAllWallets();
  fetchTransactionStats();
});
</script>

<style lang="scss" scoped>
.button-row {
  .btn-sm {
    @apply py-0.5 px-5 h-[46px] gap-x-1 font-semibold sm:mt-12;
  }
}

.overflow-row {
  @apply flex justify-start items-center gap-8 mb-9 flex-wrap;
}

.tax-row {
  @apply flex justify-between items-center gap-8 mb-9 sm:flex-col;

  &--left {
    @apply w-1/2 sm:w-full;
  }

  &--right {
    @apply w-1/2 sm:w-full;
  }
}
</style>
