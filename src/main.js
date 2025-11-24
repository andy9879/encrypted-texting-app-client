import Vue, { createApp } from "vue";
import { createPinia } from "pinia";

import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

import App from "./App.vue";
import router from "./router";

//TODO only import used icons
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
