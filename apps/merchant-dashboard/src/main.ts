import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";
import constants from "@/shared/utilities/constants";

// APP STYLES IMPORT
import "./style.scss";

const app = createApp(App);
const pinia = createPinia();
const head = createHead();
const eventBus = mitt();

app.provide("eventBus", eventBus); // Provide the event bus

// Set global variable accessible across the app
app.config.globalProperties.$appVariant = constants.APP_VARIANT;

app.use(head);
app.use(pinia);
app.use(router);
app.mount("#app");
