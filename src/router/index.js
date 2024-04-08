import { createRouter, createWebHashHistory } from "vue-router";
import loginView from "@/views/login/login.vue";
import homeView from "@/views/home/home.vue";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			name: "homeView",
			component: homeView,
		},
		{
			path: "/about",
			name: "about",
			component: () => import("../views/AboutView.vue"),
		},
	],
});

export default router;
