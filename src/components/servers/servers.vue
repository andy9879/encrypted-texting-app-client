<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

socketGlobalListeners();

import { useServerDataStore } from "@/stores/serverData";

let serverData = useServerDataStore();
</script>

<template>
	<div class="content">
		<div class="row">
			<div class="col-1 server-col">
				<img width="48px" src="@/assets/testIcon.jpg" />
			</div>
			<div class="col-11">server chats</div>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
