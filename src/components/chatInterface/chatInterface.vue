<script setup>
import { ref } from "vue";
import chatInterfaceInput from "../chatInterfaceInput/chatInterfaceInput.vue";
</script>

<template>
	<div class="chat-wrapper">
		<div class="chat">
			<div class="messages">
				<div class="message">hello world</div>
			</div>
			<div class="chat-input">
				<chatInterfaceInput />
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./chatInterface.scss";
</style>
