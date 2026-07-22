import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import mitt from "mitt";
import { createPinia } from "pinia";
import { createHead } from "@vueuse/head";
import { setRefreshTokenFn } from "@packages/hooks";
import { refreshAccessToken } from "@/modules/auth/store/actions";

// APP STYLES IMPORT
import "./style.scss";

setRefreshTokenFn(refreshAccessToken);

const app = createApp(App);
const pinia = createPinia();
const head = createHead();
const eventBus = mitt();

app.provide("eventBus", eventBus); // Provide the event bus

app.use(head);
app.use(pinia);
app.use(router);
app.mount("#app");
