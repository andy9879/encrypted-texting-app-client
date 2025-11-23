<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

socketGlobalListeners();

import { useServerDataStore } from "@/stores/serverData";

let serverData = useServerDataStore();
</script>

<template>
	<div class="content">
		<div class="page-wrapper">
			<div class="server-col">
				<div class="server-icon-wrapper">
					<img width="48px" src="@/assets/testIcon.jpg" />
				</div>
			</div>
			<div>server chats</div>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
