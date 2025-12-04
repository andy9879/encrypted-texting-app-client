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
import nuke from "../icons/nuke.vue";

import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

const props = defineProps({
	send: Function,
	deleteChat: Function,
	incoming: Array,
	outgoing: Array,
});
const messagesElement = useTemplateRef("messages");

const messagesElementScroll = useScroll(messagesElement, {
	behavior: "smooth",
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

function jumpToPresent() {
	messagesElementScroll.y.value = messagesElement.value.scrollHeight;
}

let disableAutoScroll = ref(false);

onMounted(() => {
	jumpToPresent();
	setTimeout(() => {
		jumpToPresent();
	}, 100);

	watch(messagesElementScroll.y, () => {
		if (
			messagesElement.value.scrollHeight -
				messagesElement.value.clientHeight -
				messagesElementScroll.y.value >
			200
		) {
			disableAutoScroll.value = true;
		}
	});

	watch(messagesElementScroll.arrivedState, () => {
		if (messagesElementScroll.arrivedState.bottom) {
			disableAutoScroll.value = false;
		}
	});

	watch(messages, () => {
		if (!disableAutoScroll.value) {
			messagesElementScroll.y.value = messagesElement.value.scrollHeight;
		}
		messagesElementScroll.measure();
	});
});
</script>

<template>
	<div class="chat-wrapper">
		<div>
			<nuke v-b-modal.modal-1 class="deleteIcon" width="24px" height="24px"></nuke>

			<b-modal
				@ok="props.deleteChat"
				id="modal-1"
				size="lg"
				title="Delete Chat"
				class="deleteChatModal"
			>
				<p>Are you sure you want to delete the entire chat?</p>
				<p>This will not delete the chat for the other user</p>
				<template #modal-footer="{ ok, cancel }">
					<b-button @click="cancel()" style="margin-right: 10px">Cancel</b-button>
					<b-button variant="danger" @click="ok()"> Delete Chat </b-button>
				</template>
			</b-modal>
		</div>
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
