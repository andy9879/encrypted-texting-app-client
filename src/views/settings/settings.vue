<script setup>
import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";
import router from "@/router";
import { socket } from "@/scripts/socket.js";

let serverData = useServerDataStore();
let clientData = useClientDataStore();
function logout() {
	//TODO FIx stores not resetting
	serverData.$reset();
	clientData.$reset();
	socket.disconnect();
	socket.io.opts.extraHeaders.authorization = "";

	router.push("/");
}
</script>

<template>
	<button @click="logout()">Logout</button>
	<RouterLink to="/chat/servers">
		<button>Back</button>
	</RouterLink>
</template>

<style scoped>
@import "settings.scss";
</style>
