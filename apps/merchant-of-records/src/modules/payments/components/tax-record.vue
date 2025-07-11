<template>
    <PageContentWrapper :showTitle="false">
      <template v-slot:pageContent>
        <div class="tax-balance-row">
          <TaxBalanceCard
            v-for="(taxItem, index) in taxBalance"
            :key="index"
            :taxData="taxItem"
          />
        </div>
  
        <!-- TAX TABLE BLOCK -->
        <div class="tax-table-block">
          <div class="title-text">Transaction Taxes</div>
  
          <div class="category-body">
            <TableContainer
              :tableHeader="tableHeader"
              :tableBody="tableBody"
              :isLoading="isLoading"
              :emptyData="{
                title: 'No taxes recorded yet!',
                description: 'No tax transactions has been initiated on your account yet',
              }"
            >
              <TableContainerBody
                v-for="(payload, index) in tableBody"
                :key="index"
                :tableHeader="tableHeader"
                :tableData="payload"
              />
            </TableContainer>
          </div>
        </div>
      </template>
    </PageContentWrapper>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, computed, onMounted, defineProps } from "vue";
  import { TaxBalanceCard } from "@/modules/payments/components";
  import { TableHeaderType } from "@packages/models";
  import { countryCurrencies } from "@packages/constants";
  import { useProfile, useEvents, useString } from "@packages/hooks";
  import { useAuthStore } from "@/modules/auth/store";
  import { useOverviewStore } from "@/modules/overview/store";
  import {
    TableContainer,
    TableContainerBody,
    PageContentWrapper,
  } from "@packages/uikit";
  
  // Types
  interface TaxBalanceItem {
    countryFlag?: string;
    currencyShort?: string;
    currencySign?: string;
    amount: number;
  }
  
  interface TableRowData {
    date_created: string;
    reference: string;
    amount: string;
    tax: string;
    status: string;
  }
  
  interface Wallet {
    currency: string;
    tax_balance?: number;
  }
  

  const { formatNumber, getStatus } = useString();
  const authStore = useAuthStore();
  const profileUtil = new useProfile(authStore);
  const { getWallets } = useOverviewStore();
  const { processAPIRequest } = useEvents();
  
  
  const taxBalance = ref<TaxBalanceItem[]>([]);
  const isLoading = ref(false);
  
  const tableHeader = ref<TableHeaderType[]>([
    { title: "Date Created", slug: "date_created" },
    { title: "Reference ID", slug: "reference" },
    { title: "Amount", slug: "amount" },
    { title: "Tax", slug: "tax" },
    { title: "Status", slug: "status" },
  ]);
  
  const tableBody = reactive<TableRowData[]>([]);
  

  const getLocalCurrencyCode = computed(() => {
    const userProfile = profileUtil.getUser();
    return userProfile?.country?.currency_code;
  });
  
  
  const loadLocalCountryCurrency = () => {
    const localCountryPayload = countryCurrencies.find(
      (country) => country.currency.short === getLocalCurrencyCode.value
    );
  
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
    await loadLocalCountryCurrency();
  
    const response = await processAPIRequest({
      action: getWallets,
      showAlert: false,
    });
  
    if (response?.code === 200) {
      const wallets = response.data as Wallet[];
  
      // Local wallet
      const localWallet = wallets.find(
        (wallet) => wallet.currency === getLocalCurrencyCode.value
      );
  
      if (localWallet) {
        taxBalance.value[0].amount = localWallet.tax_balance ?? 0;
      }
  
      // Other wallets
      const nonLocalWallets = wallets.filter(
        (wallet) =>
          wallet.currency !== getLocalCurrencyCode.value &&
          wallet.currency !== "USD"
      );
  
      nonLocalWallets.forEach((wallet) => {
        const walletCurrencyData = countryCurrencies.find(
          (country) => country.currency.short === wallet.currency
        );
  
        const taxWalletPayload: TaxBalanceItem = {
          countryFlag: walletCurrencyData?.flag,
          currencyShort: walletCurrencyData?.currency.short,
          currencySign: walletCurrencyData?.currency.sign,
          amount: wallet.tax_balance ?? 0,
        };
  
        taxBalance.value.push(taxWalletPayload);
      });
    }
  };
  
  // Props
  const props = defineProps<{ showWrapper: boolean }>();
  
  // Lifecycle
  onMounted(() => fetchAllWallets());
  </script>
  
  <style lang="scss" scoped>
  .tax-balance-row {
    @apply flex justify-between items-center gap-8 mb-9;
  }
  
  .tax-table-block {
    @apply w-full;
  
    .title-text {
      @apply text-lg font-semibold text-grey-800 mb-7;
    }
  }
  </style>
  