import { createRouter, createWebHashHistory } from "vue-router";
import loginView from "@/views/login/login.vue";
import chatView from "@/views/chat/chat.vue";
import settingsView from "@/views/settings/settings.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "loginView",
			component: loginView,
		},
		{
			path: "/chat/:page",
			name: "chatView",
			component: chatView,
		},
		{
			path: "/settings/",
			name: "settingsView",
			component: settingsView,
		},
	],
});

export default router;
