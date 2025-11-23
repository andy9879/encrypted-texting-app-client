<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

socketGlobalListeners();

import { useServerDataStore } from "@/stores/serverData";

let serverData = useServerDataStore();
</script>

<template>
	<div class="content">Servers</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
