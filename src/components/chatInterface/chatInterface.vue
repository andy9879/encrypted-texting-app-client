<script setup>
import { ref, defineProps, computed } from "vue";
import chatInterfaceInput from "../chatInterfaceInput/chatInterfaceInput.vue";

const props = defineProps({
	send: Function,
	incoming: Array,
	outgoing: Array,
});

const messages = computed(() => {
	let messagesArr = props.incoming
		.map((message) => {
			return {
				...message,
				type: "incoming",
			};
		})
		.concat(
			props.outgoing.map((message) => {
				return {
					...message,
					type: "outgoing",
				};
			}),
		);

	return messagesArr.sort((a, b) => a.time - b.time);
});
</script>

<template>
	<div class="chat-wrapper">
		<div class="chat">
			<div class="messages">
				<div class="message" v-for="message in messages" :key="message.id">
					<div>
						{{ message.username }} |
						{{ new Date(message.time).toLocaleString() }}
					</div>
					<div class="message-text" v-html="message.text"></div>
				</div>
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
