<template>
  <MerchantDetailsWrapper :merchantId="id">
    <MerchantTabs v-model:activeTab="activeTab" />
    <component :is="currentComponent" class="tab-content" />
  </MerchantDetailsWrapper>
</template>

<script setup lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import MerchantDetailsWrapper from "../components/merchant-details-wrapper.vue";
import MerchantTabs from "../components/merchant-tabs.vue";
import Compliance from "../components/compliance.vue";
import Profile from "../components/profile.vue";
import TaxRecord from "../components/tax-record.vue";
import Balances from "../components/balances.vue";
import Transactions from "../components/transactions.vue";
import PayoutHistory from "../components/payout-history.vue";

const route = useRoute();
const id = route.params.id as string;

const activeTab = ref<string>("Transactions");

const tabComponents: Record<string, ReturnType<typeof defineComponent>> = {
  Transactions,
  Balances,
  "Payout history": PayoutHistory,
  "Tax record": TaxRecord,
  Profile,
  Compliance,
};

const currentComponent = computed(() => tabComponents[activeTab.value]);
</script>

<style scoped></style>
