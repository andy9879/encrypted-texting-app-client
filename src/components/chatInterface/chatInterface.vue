<script setup>
import { ref, defineProps } from "vue";
import chatInterfaceInput from "../chatInterfaceInput/chatInterfaceInput.vue";

const props = defineProps({
	send: Function,
});
</script>

<template>
	<div class="chat-wrapper">
		<div class="chat">
			<div class="messages">
				<div class="message">hello world</div>
			</div>
			<div class="chat-input">
				<chatInterfaceInput :send="send" />
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./chatInterface.scss";
</style>
