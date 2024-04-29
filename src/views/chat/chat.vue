<script setup>
import { ref } from "vue";

// const fs = window.electron.fs;

import { socket, socketInit } from "@/scripts/socket";

import { register } from "../../../vue-advanced-chat/dist/vue-advanced-chat.mjs";

import { user } from "@/scripts/manageFiles";
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

const currentUserId = ref("1234");
const rooms = ref([
	{
		roomId: "1",
		roomName: "Room 1",
		avatar: "assets/imgs/people.png",
		unreadCount: 4,
		index: 3,
		lastMessage: {
			_id: "xyz",
			content: "Last message received",
			senderId: "1234",
			username: "John Doe",
			timestamp: "10:20",
			saved: true,
			distributed: false,
			seen: false,
			new: true,
		},
		users: [
			{
				_id: "1234",
				username: "John Doe",
				avatar: "assets/imgs/doe.png",
				status: {
					state: "online",
					lastChanged: "today, 14:30",
				},
			},
			{
				_id: "4321",
				username: "John Snow",
				avatar: "assets/imgs/snow.png",
				status: {
					state: "offline",
					lastChanged: "14 July, 20:00",
				},
			},
		],
		typingUsers: [4321],
	},
]);
const messages = ref([
	{
		_id: "7890",
		indexId: 12092,
		content: "Message 1",
		senderId: "1234",
		username: "John Doe",
		avatar: "assets/imgs/doe.png",
		date: "13 November",
		timestamp: "10:20",
		system: false,
		saved: true,
		distributed: true,
		seen: true,
		deleted: false,
		failure: true,
		disableActions: false,
		disableReactions: false,
		files: [
			{
				name: "My File",
				size: 67351,
				type: "png",
				audio: true,
				duration: 14.4,
				url: "https://firebasestorage.googleapis.com/...",
				preview: "data:image/png;base64,iVBORw0KGgoAA...",
				progress: 88,
			},
		],
		reactions: {},
		replyMessage: {
			content: "Reply Message",
			senderId: "4321",
			files: [
				{
					name: "My Replied File",
					size: 67351,
					type: "png",
					audio: true,
					duration: 14.4,
					url: "https://firebasestorage.googleapis.com/...",
					preview: "data:image/png;base64,iVBORw0KGgoAA...",
				},
			],
		},
	},
]);
const roomActions = ref([
	{ name: "inviteUser", title: "Invite User" },
	{ name: "removeUser", title: "Remove User" },
	{ name: "deleteRoom", title: "Delete Room" },
]);

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
		<div class="navItem" :class="{ navItemSelected: page == 'addFriend' }">
			Add Friend
		</div>
		<div
			class="navItem navItemSettings"
			:class="{ navItemSelected: page == 'settings' }"
		>
			<b-icon icon="gear-fill" height="20px" width="20px"></b-icon>
		</div>
	</div>
	<div class="advanceChat">
		<vue-advanced-chat
			class="advanceChat"
			theme="dark"
			height="100%"
			:current-user-id="currentUserId"
			:rooms="JSON.stringify(rooms)"
			:messages="JSON.stringify(messages)"
			:room-actions="JSON.stringify(roomActions)"
		/>
	</div>
</template>

<style scoped>
@import "chat.scss";
</style>
