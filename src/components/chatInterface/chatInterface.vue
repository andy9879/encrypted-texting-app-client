<script setup>
import { ref } from "vue";
</script>

<template>
	<div class="chat-wrapper">
		<div class="rooms">
			<div class="room">room 1</div>
			<div class="room">room 2</div>
		</div>
		<div class="chat">
			<div class="messages">
				<div class="message">hello world</div>
			</div>
			<div class="chat-input row">
				<div class="col-10">
					<b-input></b-input>
				</div>
				<div class="col-2">
					<b-button>Send</b-button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./chatInterface.scss";
</style>
