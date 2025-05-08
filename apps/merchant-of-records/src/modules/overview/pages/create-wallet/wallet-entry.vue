<template>
  <MarketWrapper
    showActionRow
    :isPrimaryActionDisabled="isActionReady"
    :stopClickHandler="stopClickHandler"
    @onBackClick="router.push({ name: 'VesicashOverview' })"
    @onContinueClick="handleWalletEntry"
  >
    <div class="mb-7">
      <SelectOptionFieldInput
        labelId="businessMarket"
        labelTitle="Market currency"
        :labelCompact="false"
        :inputValue="marketPayload.currency"
        inputPlaceholder="Select a market currency"
        :isRequired="true"
        :selectData="supportedCurrencies"
        @onSelectionChange="marketPayload.currency = $event"
      />
    </div>

    <SelectFieldInput
      labelId="businessIncorporation"
      labelTitle="Are you incorporated in this country?"
      :labelCompact="false"
      inputPlaceholder="Select incorporation status"
      :inputValue="marketPayload.isIncorporated"
      :selectData="incorporationStatusList"
      isRequired
      @onSelectionChange="marketPayload.isIncorporated = $event"
    />
  </MarketWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { IInputType } from "@packages/models";
import { useEvents } from "@packages/hooks";
import { SelectOptionFieldInput, SelectFieldInput } from "@packages/uikit";
import { supportedCurrencies } from "@packages/constants";
import { MarketWrapper } from "@/modules/overview/components";
import { useOverviewStore } from "@/modules/overview/store";
import { useGlobalStore } from "@/modules/global/store";

type IMarketEntryType = {
  currency: string;
  isIncorporated: string;
};

type IInputValidity = {
  currency: boolean;
};

const router = useRouter();

const { createWallet } = useOverviewStore();
const { getBusinessCountries } = useGlobalStore();

const { processAPIRequest } = useEvents();

const stopClickHandler = ref<boolean>(false);

const businessCountries = ref<any>([]);

const incorporationStatusList = ref([
  { value: "incorporated", name: "Incorporated" },
  { value: "not_incorporated", name: "Not Incorporated" },
]);

const marketPayload = ref<IMarketEntryType>({
  currency: "",
  country_id: "",
  country_name: "",
  isIncorporated: "",
});

const payloadValidity = ref<IInputValidity>({
  currency: false,
});

const isActionReady = computed(() => {
  return marketPayload.value.currency ? false : true;
});

const getMarketPayload = computed(() => {
  const { currency, country_id } = marketPayload.value;

  return {
    currency,
    countryId: country_id,
  };
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
  if (marketPayload.value.isIncorporated === "incorporated") {
    router.push({
      name: "VesicashWalletDocument",
      query: {
        currency: marketPayload.value.currency,
        country: marketPayload.value.country_name,
        country_id: marketPayload.value.country_id,
      },
    });
    return;
  }

  const response = await processAPIRequest({
    action: createWallet,
    payload: getMarketPayload.value,
    alertHandler: {
      201: {
        message: "Merchant Wallet request sent",
        type: "success",
      },

      400: {
        message: "Wallet request failed",
        type: "error",
      },

      500: {
        message: "Wallet request failed",
        type: "error",
      },
    },
  });

  if (response?.code === 201) {
    setTimeout(() => router.push({ name: "VesicashWalletStatus" }), 600);
    stopClickHandler.value = false;
  } else {
    stopClickHandler.value = false;
  }
};

watch(
  () => marketPayload.value.currency,
  (value) => {
    const selectedCountry = businessCountries.value.find(
      (country) => country.currency_code === value
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
