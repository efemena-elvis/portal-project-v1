<template>
  <PageContentWrapper>
    <template v-slot:pageOptions>
      <div class="button-row">
        <router-link
          :to="
            morAccountType === 'aggregator'
              ? '/merchants/add'
              : '/market/wallet-entry'
          "
          class="btn btn-primary btn-sm hover:text-white"
        >
          <div class="text-xl font-semibold icon icon-add"></div>
          {{
            morAccountType === "aggregator"
              ? "Add merchants"
              : " Deploy a wallet"
          }}
        </router-link>
      </div>
    </template>

    <template v-slot:pageContent>
      <!-- OVERFLOW ROW -->
      <Overview v-if="morAccountType === 'aggregator'" />
      <div v-else>
        <div class="overflow-row">
          <OverviewCard
            v-for="(wallet, index) in walletBalance"
            :key="index"
            :wallet="wallet"
          />
        </div>

        <!-- TAX ROW -->
        <div class="tax-row">
          <div class="tax-row--left">
            <TaxBlock :taxList="taxBalance" />
          </div>

          <div class="tax-row--right">
            <TransactionMetrics />
          </div>
        </div>
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
import {
  OverviewCard,
  TaxBlock,
  TransactionMetrics,
  TransactionTable,
} from "@/modules/overview/components";
import { useAuthStore } from "@/modules/auth/store";
import { useOverviewStore } from "@/modules/overview/store";
import Overview from "./aggregator/overview.vue";

const authStore = useAuthStore();
const overviewStore = useOverviewStore();
const profileUtil = new useProfile(authStore);

const { getWallets, updateWalletState } = overviewStore;
const { getAllWallets } = storeToRefs(overviewStore);

const morAccountType = ref("aggregator");

const { processAPIRequest } = useEvents();

const walletBalance = ref([]);
const taxBalance = ref([]);

// const morAccountType = computed(() => {
//   const userProfile = profileUtil?.getUser();
//   return userProfile?.morAccountType;
// });

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const loadLocalCountryCurrency = (country: string) => {
  const localCountryPayload = countryCurrencies.find(
    (country) => country.currency.short === getLocalCurrencyCode.value
  );

  walletBalance.value = [
    {
      countryFlag: localCountryPayload?.flag,
      description: localCountryPayload?.currency.description,
      currencyShort: localCountryPayload?.currency.short,
      currencySign: localCountryPayload?.currency.sign,
      amount: 0,
    },
  ];

  taxBalance.value = [
    {
      countryFlag: localCountryPayload?.flag,
      currencyShort: localCountryPayload?.currency.short,
      currencySign: localCountryPayload?.currency.sign,
      amount: 0,
    },
  ];
};

const fetchAllWallets = async () => {
  // LOAD LOCAL CURRENCY
  console.log(getAllWallets.value);
  console.log(Object.keys(getAllWallets.value));

  if (getAllWallets?.value?.walletBalance.length === 0) {
    await loadLocalCountryCurrency();
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
    const nonLocalWallets = response.data.filter(
      (wallet: any) =>
        wallet.currency !== getLocalCurrencyCode.value &&
        wallet.currency !== "USD"
    );

    nonLocalWallets.forEach((wallet: any) => {
      const walletPayload = {};
      const taxWalletPayload = {};

      const walletCurrencyData = countryCurrencies.find(
        (country) => country.currency.short === wallet.currency
      );

      walletPayload.countryFlag = walletCurrencyData?.flag;
      walletPayload.description = walletCurrencyData?.currency.description;
      walletPayload.currencyShort = walletCurrencyData?.currency.short;
      walletPayload.currencySign = walletCurrencyData?.currency.sign;
      walletPayload.amount = wallet?.market_balance ?? 0;

      taxWalletPayload.countryFlag = walletCurrencyData?.flag;
      taxWalletPayload.currencyShort = walletCurrencyData?.currency.short;
      taxWalletPayload.currencySign = walletCurrencyData?.currency.sign;
      taxWalletPayload.amount = wallet?.tax_balance ?? 0;

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

onMounted(() => fetchAllWallets());
</script>

<style lang="scss" scoped>
.button-row {
  .btn-sm {
    @apply py-0.5 px-5 h-[46px] gap-x-1 font-semibold;
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
