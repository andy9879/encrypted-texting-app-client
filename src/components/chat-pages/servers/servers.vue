<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";
import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

import chatInterface from "@/components/chatInterface/chatInterface.vue";

let clientData = useClientDataStore();

let showServer = ref(true);
</script>

<template>
	<div class="content">
		<div class="page-wrapper">
			<div class="server-col">
				<div class="row">
					<div class="col-4">
						<div class="server-icon-col-wrapper">
							<div class="direct-message-wrapper">
								<span
									@click="showServer = !showServer"
									class="pi pi-users direct-message"
								></span>
							</div>
							<img width="48px" src="@/assets/testIcon.jpg" />
						</div>
					</div>
					<div class="col-8">
						<div v-show="showServer">test</div>
						<div v-show="!showServer">friend</div>
					</div>
				</div>
			</div>

			<chat-interface style="width: 100%; height: 100%"></chat-interface>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
