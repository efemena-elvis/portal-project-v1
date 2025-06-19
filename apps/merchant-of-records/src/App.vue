<template>
  <MetaData
    baseTitle="Merchant of Records"
    pageDescription="RedstonePGS offers seamless and secure payment gateway services for mobile money, card payments, and bank transfers. We ensure your transactions are fraud-free, collected efficiently, and settled on time. Discover reliable payment solutions with RedstonePGS."
    keywords="payment gateway service, secure payment solutions, mobile money payments, card payment gateway, bank transfer solutions, fraud-free payment service, seamless payment processing, timely payment settlement, online payment solutions"
    companyName="Vesicash Innovative Technologies"
    companyCreator="Vesicash Innovative Technologies Tech Team"
    companyBaseUrl="https://www.vesicash.com"
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
import { inject, onMounted, ref } from "vue";
import { Emitter } from "mitt";
import { MetaData, ToastCard } from "@packages/uikit";

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

const eventBus = inject<Emitter<Events>>("eventBus");
// const { pushToastAlert } = useEvents();

const alertInfo = ref<IAlertInfo>({
  message: "",
  description: "",
  type: "",
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
