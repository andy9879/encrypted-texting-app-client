<script setup>
import { ref } from "vue";
</script>

<template>
	<div class="chat-wrapper">
		<div class="rooms">
			<div class="room room-selected">room 1</div>
			<div class="room">room 2</div>
		</div>
		<div class="chat">
			<div class="messages">
				<div class="message">hello world</div>
			</div>
			<div class="chat-input">
				<span class="text-input-wrapper">
					<b-input></b-input>
				</span>
				<span style="margin-left: 5px">
					<b-button>Send</b-button>
				</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./chatInterface.scss";
</style>
