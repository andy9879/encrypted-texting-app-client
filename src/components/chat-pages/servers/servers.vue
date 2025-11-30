<script setup>
import { ref } from "vue";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

import chatInterface from "@/components/chatInterface/chatInterface.vue";
import { requestPreKeyBundle } from "@/scripts/serverApi.js";
import {
	getSharedSecret,
	verifySig,
	createKeyPair,
	hkdf,
} from "@/scripts/manageKeys.js";

let clientData = useClientDataStore();

let showServer = ref(true);
let selectedFriendId = ref(null);

async function send(text) {
	//TODO better error handling when friendId is null
	if (!showServer || selectedFriendId === null) return;

	let friend = clientData.data.friends.find(
		(friend) => friend.id === selectedFriendId.value,
	);

	console.log(text);

	let outgoing = friend.privetMessage.outgoing;

	if (outgoing.secret === null) {
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

		let secret = await hkdf(sharedSecretArr, keyBundle.oK.id);

		console.log(secret);
	}
}
</script>

<template>
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
							<div class="friends">
								<div v-if="clientData.data.friends.length === 0">No Friends ):</div>
								<div
									v-for="friend in clientData.data.friends"
									:key="friend.username"
									:class="{
										row: true,
										friend: true,
										friendSelected: friend.id === selectedFriendId,
									}"
									@click="selectedFriendId = friend.id"
								>
									<div class="col-4">
										<Suspense>
											<asyncProfilePicture
												:username="friend.username"
											></asyncProfilePicture>
											<!-- TODO Add betting loading screen -->
											<template #fallback> Loading... </template>
										</Suspense>
									</div>
									<div class="col-8 friend-username">{{ friend.username }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				v-if="!showServer && selectedFriendId === null"
				class="no-friend-selected"
			>
				No Friend selected
			</div>

			<chat-interface
				:send="send"
				v-else
				style="width: 100%; height: 100%"
			></chat-interface>
		</div>
	</div>
</template>

<style scoped>
@import "./servers.scss";
</style>
