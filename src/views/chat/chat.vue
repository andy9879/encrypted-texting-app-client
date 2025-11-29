<script setup>
import { ref } from "vue";

// const fs = window.electron.fs;

import { socket, socketInit } from "@/scripts/socket";

import router from "@/router";

import addFriend from "@/components/chat-pages/addFriend/addFriend.vue";
import servers from "@/components/chat-pages/servers/servers.vue";

import { useRoute } from "vue-router";
const route = useRoute();

let page = ref(route.params.page);

import { checkPreKeyBundles } from "@/scripts/manageKeys";

// import io, { connect } from "socket.io-client";

checkPreKeyBundles();

function changePage(newPage) {
	page.value = newPage;
}

// $("#toast").toast();
</script>

<template>
	<div class="navBar">
		<div
			@click="changePage('servers')"
			class="navItem"
			:class="{ navItemSelected: page == 'servers' }"
		>
			Servers
		</div>
		<div
			@click="changePage('addFriend')"
			class="navItem"
			:class="{ navItemSelected: page == 'addFriend' }"
		>
			Add Friend
		</div>

		<div
			class="navItem navItemSettings"
			:class="{ navItemSelected: page == 'settings' }"
		>
			<RouterLink to="/settings/">
				<b-icon icon="gear-fill" height="20px" width="20px"></b-icon>
			</RouterLink>
		</div>
	</div>

	<div class="page">
		<div v-show="page == 'addFriend'">
			<addFriend></addFriend>
		</div>
		<div v-show="page == 'servers'">
			<servers></servers>
		</div>
	</div>
</template>

<style scoped>
@import "chat.scss";
</style>
