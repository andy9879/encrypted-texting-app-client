<script setup>
import { ref, computed, watch } from "vue";
import { v4 as uuid } from "uuid";

import { useClientDataStore } from "@/stores/clientData";

import chatInterface from "@/components/chatInterface/chatInterface.vue";
import { requestPreKeyBundle } from "@/scripts/serverApi.js";
import {
	getSharedSecret,
	verifySig,
	createKeyPair,
	hkdf,
	encrypt,
} from "@/scripts/manageKeys.js";
import { socket } from "@/scripts/socket";
import profileInfo from "@/components/profileInfo/profileInfo.vue";
import chatFriendsList from "@/components/chatFriendsList/chatFriendsList.vue";
import { sanitize } from "@/scripts/sanitize";

let clientData = useClientDataStore();

let showServer = ref(true);
let selectedFriendId = ref(null);

const selectedFriend = computed(() => {
	if (selectedFriendId.value === null) return null;

	let friend = clientData.data.friends.find(
		(friend) => friend.id === selectedFriendId.value,
	);

	return friend ?? null;
});

watch(selectedFriendId, () => {
	let friend = clientData.data.friends.find(
		(friend) => friend.id === selectedFriendId.value,
	);

	if (friend === undefined) return;

	friend.privetMessage.incoming.unread = 0;

	clientData.writeData();
});

async function send(text) {
	//TODO better error handling when friendId is null
	if (!showServer || selectedFriendId === null) return;

	let friend = clientData.data.friends.find(
		(friend) => friend.id === selectedFriendId.value,
	);

	let outgoing = friend.privetMessage.outgoing;

	let secret = null;

	//TODO add error handling when request preKey Bundle fails
	let keyBundle = (await requestPreKeyBundle(friend.id)).bundle;

	let verify = await verifySig(keyBundle.sK.sig, keyBundle.sK.pub, friend.iK);

	//TODO Better error handling when verify fails
	if (!verify) return;

	let eK = await createKeyPair();

	let sharedSecretArr = await Promise.all([
		getSharedSecret(eK.priv, friend.iK),
		getSharedSecret(clientData.data.iK.priv, keyBundle.sK.pub),
		getSharedSecret(eK.priv, keyBundle.sK.pub),
		getSharedSecret(eK.priv, keyBundle.oK.pub),
	]);

	secret = await hkdf(
		sharedSecretArr.reduce((newSecret, secret) => {
			return newSecret + secret;
		}),
		keyBundle.oK.id,
	);

	let encryptedText = await encrypt(secret, text);

	let time = Date.now();
	let messageId = uuid();

	let message = {
		id: messageId,
		encryptedText,
		eK: eK?.pub ?? null,
		oKId: keyBundle?.oK?.id ?? null,
		to: friend.id,
		time,
	};

	outgoing.messages.push({
		text: sanitize(text),
		time,
		id: messageId,
	});

	clientData.writeData();

	socket.emit("sendPrivateMessage", message);
}

function deleteChat() {
	//TODO possibly deleted the recorded of decrypted ids to
	let friend = clientData.data.friends.find(
		(friend) => friend.id === selectedFriendId.value,
	);

	if (friend === undefined) return;

	friend.privetMessage.incoming.messages = [];
	friend.privetMessage.outgoing.messages = [];

	clientData.writeData();
}

const incomingMessages = computed(() => {
	if (selectedFriend.value === null) {
		return [];
	}

	return selectedFriend.value.privetMessage.incoming.messages.map((message) => {
		return {
			...message,
			userId: selectedFriend.value.id,
			username: selectedFriend.value.username,
		};
	});
});

const outgoingMessages = computed(() => {
	if (selectedFriend.value === null) {
		return [];
	}

	return selectedFriend.value.privetMessage.outgoing.messages.map((message) => {
		return {
			...message,
			userId: clientData.data.id,
			username: clientData.data.username,
		};
	});
});
</script>

<template>
	<div class="page">
		<div class="content">
			<div class="page-wrapper">
				<div class="server-col">
					<div class="row">
						<div class="col-3">
							<div class="server-icon-col-wrapper">
								<div class="direct-message-wrapper">
									<span
										@click="showServer = !showServer"
										class="pi pi-users direct-message"
									></span>
								</div>
								<img width="48px" src="@/assets/testIcon.jpg" />
							</div>
						</div>
						<div class="col-9" style="padding: 0">
							<div v-show="showServer">test</div>
							<div v-show="!showServer">
								<chatFriendsList v-model:selectedFriendId="selectedFriendId" />
							</div>
						</div>
					</div>
					<profile-info />
				</div>
				<div
					v-if="!showServer && selectedFriendId === null"
					class="no-friend-selected"
				>
					No Friend selected
				</div>

				<chat-interface
					:send="send"
					:deleteChat="deleteChat"
					:incoming="incomingMessages"
					:outgoing="outgoingMessages"
					v-else
					style="width: 100%; height: 100%"
				></chat-interface>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "chat.scss";
</style>
