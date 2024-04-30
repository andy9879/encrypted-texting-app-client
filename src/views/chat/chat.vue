<script setup>
import { ref } from "vue";

// const fs = window.electron.fs;

import { socket, socketInit } from "@/scripts/socket";

import { register } from "../../../vue-advanced-chat/dist/vue-advanced-chat.mjs";

import { user } from "@/scripts/manageFiles";
import { UserData as globalUserData } from "@/scripts/userData";

import router from "@/router";

import addFriend from "@/components/addFriend/addFriend.vue";

import { useRoute } from "vue-router";
const route = useRoute();

let page = ref(route.params.page);

import { checkPreKeyBundles } from "@/scripts/manageKeys";
//https://www.npmjs.com/package/vue-advanced-chat
register();

// import io, { connect } from "socket.io-client";

checkPreKeyBundles();

async function connectToServer(url, port) {
	loadingWheel.value = true;
	console.log(url);
	console.log(port);

	//TODO Add error handling

	let socket = null;

	function connected() {
		return new Promise((resolve) => {
			socket = io(url + ":" + port);
			socket.on("connect", resolve);
		});
	}

	await connected();

	console.log("Connected to Server");

	return socket;
}

function changePage(newPage) {
	page.value = newPage;
}

// $("#toast").toast();
</script>

<template>
	<div class="navBar">
		<div class="navItem" :class="{ navItemSelected: page == 'servers' }">
			Servers
		</div>
		<div class="navItem" :class="{ navItemSelected: page == 'friends' }">
			Friends
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
			<b-icon icon="gear-fill" height="20px" width="20px"></b-icon>
		</div>
	</div>

	<div class="page">
		<div v-show="page == 'addFriend'">
			<addFriend></addFriend>
		</div>
	</div>
</template>

<style scoped>
@import "chat.scss";
</style>
