import { createRouter, createWebHashHistory } from "vue-router";
import loginView from "@/views/login/login.vue";
import homeView from "@/views/home/home.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "loginView",
			component: loginView,
		},
		{
			path: "/about",
			name: "about",
			component: () => import("../views/AboutView.vue"),
		},
	],
});

export default router;
