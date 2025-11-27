<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

import { useServerDataStore } from "@/stores/serverData";

import { useClientDataStore } from "@/stores/clientData";

let serverData = useServerDataStore();

let clientData = useClientDataStore();
</script>

<template>
	<div class="content">
		<h1>Friends</h1>
		<hr />
		<div class="friends">
			<div
				v-for="friend in clientData.data.friends"
				:key="friend.username"
				class="row"
			>
				<div class="col-1">
					<img width="64px" height="64px" src="@/assets/testIcon.jpg" />
				</div>
				<div class="col-4">Username</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./friends.scss";
</style>
