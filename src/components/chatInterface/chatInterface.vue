<script setup>
import {
	ref,
	defineProps,
	computed,
	useTemplateRef,
	watch,
	onMounted,
} from "vue";
import { useScroll } from "@vueuse/core";
import chatInterfaceInput from "../chatInterfaceInput/chatInterfaceInput.vue";
import { useServerDataStore } from "@/stores/serverData";

import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

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
			})
		);

	return messagesArr.sort((a, b) => a.time - b.time);
});

const messagesElement = useTemplateRef("messages");
const { x, y, isScrolling, arrivedState, directions, measure } = useScroll(
	messagesElement,
	{ behavior: "smooth" }
);

let disableAutoScroll = ref(false);

watch(messages, () => {
	if (!disableAutoScroll.value) {
		y.value = messagesElement.value.scrollHeight;
		measure();
	}
});

function jumpToPresent() {
	y.value = messagesElement.value.scrollHeight;
}

watch(y, () => {
	if (
		messagesElement.value.scrollHeight -
			messagesElement.value.clientHeight -
			y.value >
		500
	) {
		disableAutoScroll.value = true;
	}
});

watch(arrivedState, () => {
	console.log(arrivedState);
	if (arrivedState.bottom) {
		disableAutoScroll.value = false;
	}
});

onMounted(() => {
	y.value = messagesElement.value.scrollHeight;
});
</script>

<template>
	<div class="chat-wrapper">
		<div class="chat">
			<div class="messages" ref="messages">
				<div class="message" v-for="message in messages" :key="message.id">
					<div class="profile-picture">
						<Suspense>
							<asyncProfilePicture
								:username="message.username"
								width="42px"
								height="42px"
							/>
							<!-- TODO Add better loading screen -->
							<template #fallback> Loading... </template>
						</Suspense>
					</div>
					<div class="message-wrapper">
						<div>
							{{ message.username }} |
							{{ new Date(message.time).toLocaleString() }}
						</div>
						<div class="message-text" v-html="message.text"></div>
					</div>
				</div>
			</div>
			<div v-show="disableAutoScroll" @click="jumpToPresent()" class="jump">
				Jump To Present
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
