<template>
  <MarketWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'VesicashOverview' })"
    @onContinueClick="handleWalletEntry"
  >
    <div class="mb-4">
      <SelectOptionFieldInput
        labelId="businessMarket"
        labelTitle="Select a new market"
        :labelCompact="false"
        :inputValue="marketPayload.currency"
        inputPlaceholder="Select a market"
        :isRequired="true"
        :selectData="getMarketCurrencies"
        @onSelectionChange="marketPayload.currency = $event"
      />
    </div>
  </MarketWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useEvents, useProfile } from "@packages/hooks";
import { SelectOptionFieldInput } from "@packages/uikit";
import { supportedCurrencies } from "@packages/constants";
import { MarketWrapper } from "@/modules/overview/components";
import { useOverviewStore } from "@/modules/overview/store";
import { useAuthStore } from "@/modules/auth/store";
import { useGlobalStore } from "@/modules/global/store";

type IMarketEntryType = {
  currency: string;
  country_id: string;
  country_name: string;
};

type IInputValidity = {
  currency: boolean;
};

const router = useRouter();

const authStore = useAuthStore();
const overviewStore = useOverviewStore();

const { getBusinessCountries } = useGlobalStore();
const { getAllWallets } = storeToRefs(overviewStore);

const { processAPIRequest } = useEvents();
const profileUtil = new useProfile(authStore);

const stopClickHandler = ref<boolean>(false);

const businessCountries = ref<any>([]);

const marketPayload = ref<IMarketEntryType>({
  currency: "",
  country_id: "",
  country_name: "",
});

const payloadValidity = ref<IInputValidity>({
  currency: false,
});

const getLocalCurrencyCode = computed(() => {
  const userProfile = profileUtil.getUser();
  return userProfile?.country?.currency_code;
});

const getMarketCurrencies = computed(() => {
  const deployedWallets = [
    ...getAllWallets.value?.walletBalance.map((wallet) => wallet.currencyShort),
    getLocalCurrencyCode.value,
  ];

  return supportedCurrencies.filter(
    (currency) => !deployedWallets.includes(currency.value)
  );
});

const isActionReady = computed(() => {
  return marketPayload.value.currency ? false : true;
});

// FETCH BUSINESS COUNTRIES
const fetchBusinessCountries = async () => {
  const response = await processAPIRequest({
    action: getBusinessCountries,
    showAlert: false,
  });

  if (response.code === 200) {
    businessCountries.value = response.data;
  }
};

// HANDLE WALLET ENTRY FLOW
const handleWalletEntry = async () => {
  router.push({
    name: "VesicashWalletDocument",
    query: {
      currency: marketPayload.value.currency,
      country: marketPayload.value.country_name,
      country_id: marketPayload.value.country_id,
    },
  });
};

watch(
  () => marketPayload.value.currency,
  (value) => {

    const selectedCountry = businessCountries.value.find(
      (country: any) => country.currency_code === value
    );

    marketPayload.value.country_id = selectedCountry?.id;
    marketPayload.value.country_name = selectedCountry?.name;
  },
  {}
);

// ON MOUNT
onMounted(() => {
  fetchBusinessCountries();

});
</script>

<style lang="scss" scoped></style>
