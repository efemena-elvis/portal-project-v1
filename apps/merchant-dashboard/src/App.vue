<template>
  <MetaData
    :baseTitle="`${getSEOProperties.baseTitle}`"
    :pageDescription="`${getSEOProperties.pageDescription}`"
    :keywords="`${getSEOProperties.keywords}`"
    :companyName="`${getSEOProperties.companyName}`"
    :companyCreator="`${getSEOProperties.companyCreator}`"
    :companyBaseUrl="`${getSEOProperties.companyBaseUrl}`"
  />

  <div id="app">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>

  <!-- TOAST ALERT CARD -->
  <ToastCard
    v-if="alertInfo.message"
    :message="alertInfo.message"
    :description="alertInfo.description"
    :type="alertInfo.type"
  />
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from "vue";
import { Emitter } from "mitt";
import { MetaData, ToastCard } from "@packages/uikit";
import { useAppVariant } from "@packages/hooks";

type IAlertInfo = {
  message: string;
  description: string;
  type: string;
};

// Define the type of the event bus
type Events = {
  triggerToastAlert: IAlertInfo;
  closeToastAlert: void;
};

const appVariant = ref<string>(useAppVariant());
const eventBus = inject<Emitter<Events>>("eventBus");

const alertInfo = ref<IAlertInfo>({
  message: "",
  description: "",
  type: "",
});

const appVariantSEO = ref<{
  [key: string]: {
    baseTitle: string;
    pageDescription: string;
    keywords: string;
    companyName: string;
    companyCreator: string;
    companyBaseUrl: string;
  };
}>({
  redstonepgs: {
    baseTitle: "Redstone Payment Gateway",
    pageDescription: "Redstone Payment Gateway Services",
    keywords: "Redstone, Payment, Gateway, Services",
    companyName: "Redstone Payment Gateway Services",
    companyCreator: "Redstone Payment Gateway Tech Team",
    companyBaseUrl: "https://www.redstonepgs.com",
  },

  alexpay: {
    baseTitle: "AlexPay",
    pageDescription: "AlexPay Services",
    keywords: "AlexPay, Payments, Services",
    companyName: "AlexPay Services",
    companyCreator: "AlexPay Tech Team",
    companyBaseUrl: "https://www.alexpay.com",
  },
});

const getSEOProperties = computed(() => {
  return {
    baseTitle: appVariantSEO.value[appVariant.value].baseTitle,
    pageDescription: appVariantSEO.value[appVariant.value].pageDescription,
    keywords: appVariantSEO.value[appVariant.value].keywords,
    companyName: appVariantSEO.value[appVariant.value].companyName,
    companyCreator: appVariantSEO.value[appVariant.value].companyCreator,
    companyBaseUrl: appVariantSEO.value[appVariant.value].companyBaseUrl,
  };
});

const updateAlertPayload = (message = "", description = "", type = "") => {
  alertInfo.value.message = message;
  alertInfo.value.description = description;
  alertInfo.value.type = type;
};

onMounted(() => {
  eventBus?.on(
    "triggerToastAlert",
    ({ message, description, type }: IAlertInfo) => {
      updateAlertPayload(message, description, type);
    }
  );

  eventBus?.on("closeToastAlert", () => {
    updateAlertPayload();
  });
});
</script>

<style scoped>
html,
body {
  scroll-behavior: smooth;
}

.fade-enter {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.225s ease;
}

.fade-leave-active {
  transition: opacity 0.225s ease;
  opacity: 0;
}
</style>
