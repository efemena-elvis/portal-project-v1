<template>
  <PageContentWrapper>
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
              description:
                'No tax transactions has been initiated on your account yet',
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
import { ref, reactive, h, computed, onMounted } from "vue";
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

const { formatNumber, getStatus } = useString();

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);

const { getWallets } = useOverviewStore();
const { processAPIRequest } = useEvents();

const taxBalance = ref([]);
const isLoading = ref(false);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Date Created", slug: "date_created" },
  { title: "Reference ID", slug: "reference" },
  { title: "Amount", slug: "amount" },
  { title: "Tax", slug: "tax" },
  { title: "Status", slug: "status" },
]);

const tableBody = reactive<any[]>([
  // {
  //   date_created: "Tue, 12th April 2025",
  //   reference: "3202-1231-45390",
  //   amount: `ZMW${formatNumber(500000)}`,
  //   tax: `ZMW${formatNumber(2500)}`,
  //   status: `${getStatus("success", "Successful")}`,
  // },
]);

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const loadLocalCountryCurrency = (country: string) => {
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
  // LOAD LOCAL CURRENCY
  await loadLocalCountryCurrency();

  const response = await processAPIRequest({
    action: getWallets,
    showAlert: false,
  });

  if (response?.code === 200) {
    // GET LOCAL WALLET BALANCES
    const localWallet = response.data.find(
      (wallet: any) => wallet.currency === getLocalCurrencyCode.value
    );

    taxBalance.value[0].amount = localWallet?.tax_balance ?? 0;

    // LOAD OTHER CURRENCIES BALANCE
    const nonLocalWallets = response.data.filter(
      (wallet: any) =>
        wallet.currency !== getLocalCurrencyCode.value &&
        wallet.currency !== "USD"
    );

    nonLocalWallets.forEach((wallet: any) => {
      const taxWalletPayload = {};

      const walletCurrencyData = countryCurrencies.find(
        (country) => country.currency.short === wallet.currency
      );

      taxWalletPayload.countryFlag = walletCurrencyData?.flag;
      taxWalletPayload.currencyShort = walletCurrencyData?.currency.short;
      taxWalletPayload.currencySign = walletCurrencyData?.currency.sign;
      taxWalletPayload.amount = wallet?.tax_balance ?? 0;

      taxBalance.value.push(taxWalletPayload);
    });
  }
};

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
