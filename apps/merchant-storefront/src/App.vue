<template>
  <MetaData
    baseTitle="Storo Storefront | Zambia's Trusted E-commerce Marketplace"
    pageDescription="Storo is Zambia's leading online marketplace offering a wide selection of quality products, fast delivery, and secure payments. Shop electronics, fashion, groceries, and more - all from the comfort of your home. Experience safe, convenient, and reliable e-commerce with Storo."
    keywords="Storo Zambia, online shopping Zambia, Zambian e-commerce, buy electronics Zambia, fashion online Zambia, grocery delivery Zambia, secure online store, Zambian online marketplace, Storo shopping, Storo e-commerce"
    companyName="Storo Zambia Ltd."
    companyCreator="Storo Zambia Tech Team"
    companyBaseUrl="https://www.storo.com"
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
