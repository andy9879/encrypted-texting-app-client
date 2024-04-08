import { createRouter, createWebHashHistory } from "vue-router";
import loginView from "@/views/login/login.vue";
import chatView from "@/views/chat/chat.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "loginView",
			component: loginView,
		},
		{
			path: "/chat",
			name: "chatView",
			component: chatView,
		},
	],
});

export default router;
