import Vue, { createApp } from "vue";
import { createPinia } from "pinia";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import App from "./App.vue";
import router from "./router";

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
