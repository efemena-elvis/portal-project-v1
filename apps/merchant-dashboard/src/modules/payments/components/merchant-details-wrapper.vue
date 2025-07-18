<template>
  <div class="sm:mt-16 -mt-3">
    <div class="flex items-center justify-between">
      <button class="btn-row w-[70px]" @click="handleGoBack">Back</button>
  
      <div class="flex gap-5">
        <button class="btn-row w-[120px] bg-green-500 text-white">Initiate payout</button>
        <button class="btn-row w-[120px]">Delete merchant</button>
      </div>
    </div>
    <div class="flex flex-col gap-8 my-8">
      <div>
        <p class="mb-2 text-3xl font-semibold -ml-1">TerraFirma Solutions</p>
        <div class="flex items-center gap-4">
          <p class="text-grey-600">ID - {{props.merchantId }}</p>
          <span
            class="text-green-400 bg-green-50/75 border-green-100/40 w-[70px] p-1 rounded-full text-center"
            >Verified</span
          >
        </div>
      </div>

      <div
        class="max-w-xl py-6 px-4 border rounded-2xl border-grey-100 flex gap-6"
      >
        <div
          class="flex justify-center gap-16 border-r border-r-grey-100 w-1/2"
        >
          <div class="flex items-center gap-3">
            <div class="country-flag">
              <img
                :src="baseCountry?.countryFlag"
                :alt="baseCountry?.currencyShort"
              />
            </div>
            <span class="text-grey-500 text-[14px]">{{
              baseCountry?.currencyShort
            }}</span>
          </div>
          <span class="font-bold text-2xl">
            {{ baseCountry?.currencySign }}{{ formatNumber(0) }}</span
          >
        </div>

        <div class="flex gap-16 w-1/2 justify-center">
          <div class="flex items-center gap-3">
            <div class="country-flag">
              <img
                :src="allTransactions?.countryFlag"
                :alt="allTransactions?.currencyShort"
              />
            </div>
            <span class="text-grey-500 text-[14px]">{{
              allTransactions?.currencyShort
            }}</span>
          </div>
          <span class="font-bold text-2xl">
            {{ allTransactions?.currencySign }}{{ formatNumber(0) }}</span
          >
        </div>
      </div>
    </div>
    <slot/>
  </div>
</template>

<script setup lang="ts">
import { useProfile, useString } from "@packages/hooks";
import { computed, onMounted, reactive, ref } from "vue";
import {  useRouter } from "vue-router";
import { useAuthStore } from "../../auth/store";
import { countryCurrencies } from "@packages/constants";
import { TableHeaderType } from "@packages/models";

interface IAllTransactions {
  countryFlag?: string;
  description?: string;
  currencyShort?: string;
  currencySign?: string;
  amount?: number;
}

const authStore = useAuthStore();
const profileUtil = new useProfile(authStore);
const router = useRouter();
const { formatNumber, getStatus } = useString();


const allTransactions = ref<IAllTransactions | null>(null);
const baseCountry = ref<IAllTransactions | null>(null);

const isLoading = ref(true);

const tableHeader = ref<TableHeaderType[]>([
  { title: "Transactions", slug: "transactions" },
  { title: "Balances", slug: "balances" },
  { title: "Payout histort", slug: "payouts" },
  { title: "Profile", slug: "profile" },
  { title: "Compliance", slug: "compliance" },
]);

const dummyTableBody = [
  {
    business: "Acme Corp",
    date: "Mon, 12 May, 2025",
    id: "ACM-00123",
    email: "contact@acmecorp.com",
    status: getStatus("verified", "verified"),
  },
  {
    business: "Beta Traders",
    date: "Tue, 13 May, 2025",
    id: "BTA-00456",
    email: "support@betatraders.com",
    status: getStatus("verified", "verified"),
  },
  {
    business: "Zeno Electronics",
    date: "Wed, 14 May, 2025",
    id: "ZEN-00789",
    email: "sales@zenoelectronics.com",
    status: getStatus("pending", "pending"),
  },
];

const tableBody = reactive<any[]>([]);
const tablePaging = ref<any>({});

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const loadLocalCountryCurrency = () => {
  const localCountryPayload = countryCurrencies.find(
    (country) => country.currency.short === getLocalCurrencyCode.value
  );

  const baseCountryPayload = countryCurrencies.find(
    (country) => country.country === "United States of America"
  );

  allTransactions.value = {
    countryFlag: localCountryPayload?.flag,
    description: localCountryPayload?.currency.description,
    currencyShort: localCountryPayload?.currency.short,
    currencySign: localCountryPayload?.currency.sign,
    amount: 0,
  };

  baseCountry.value = {
    countryFlag: baseCountryPayload?.flag,
    description: baseCountryPayload?.currency.description,
    currencyShort: baseCountryPayload?.currency.short,
    currencySign: baseCountryPayload?.currency.sign,
    amount: 0,
  };
};


const handleGoBack = () => {
  router.back();
};


const props = defineProps(["merchantId"])

onMounted(() => {
  loadLocalCountryCurrency();
  // console.log(allTransactions.value);
});
</script>

<style scoped lang="scss">
.btn-row {
  @apply p-2 border rounded-lg cursor-pointer hover:bg-gray-100 border-grey-100;
}
.country-flag {
  @apply relative size-6 rounded-full overflow-hidden;

  img {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-11;
  }
}
</style>
