<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";
import { register } from "vue-advanced-chat";
import { useServerDataStore } from "@/stores/serverData";
register();

socketGlobalListeners();

let serverData = useServerDataStore();

currentUserId: "1234";
let rooms = ref([]);
let messages = ref([]);
let roomActions = ref([
	{ name: "inviteUser", title: "Invite User" },
	{ name: "removeUser", title: "Remove User" },
	{ name: "deleteRoom", title: "Delete Room" },
]);
</script>

<template>
	<div class="content">
		<div class="page-wrapper">
			<div class="server-col">
				<div class="server-icon-wrapper">
					<img width="48px" src="@/assets/testIcon.jpg" />
				</div>
			</div>
			<div></div>
			<div>
				<vue-advanced-chat
					:current-user-id="currentUserId"
					:rooms="JSON.stringify(rooms)"
					:messages="JSON.stringify(messages)"
					:room-actions="JSON.stringify(roomActions)"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
