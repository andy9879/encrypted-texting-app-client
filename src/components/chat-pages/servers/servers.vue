<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";
import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

import chatInterface from "@/components/chatInterface/chatInterface.vue";

let clientData = useClientDataStore();

socketGlobalListeners();
</script>

<template>
	<div class="content">
		<div class="page-wrapper">
			<div class="server-col">
				<div class="server-icon-wrapper">
					<img width="48px" src="@/assets/testIcon.jpg" />
				</div>
			</div>

			<chat-interface style="width: 100%; height: 100%"></chat-interface>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
