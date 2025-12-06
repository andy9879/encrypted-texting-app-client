<script setup>
import { defineModel } from "vue";
import { useClientDataStore } from "@/stores/clientData";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

let clientData = useClientDataStore();

let selectedFriendId = defineModel("selectedFriendId");
</script>

<template>
	<div class="friends">
		<div v-if="clientData.data.friends.length === 0">No Friends ):</div>
		<div
			v-for="friend in clientData.data.friends"
			:key="friend.username"
			:class="[
				['row'],
				['friend'],
				{ friendSelected: friend.id === selectedFriendId },
			]"
			@click="selectedFriendId = friend.id"
		>
			<div class="col-4">
				<Suspense>
					<asyncProfilePicture :username="friend.username"></asyncProfilePicture>
					<!-- TODO Add betting loading screen -->
					<template #fallback> Loading... </template>
				</Suspense>
			</div>
			<div class="col-6 friend-username">{{ friend.username }}</div>
			<div class="col-2 unread-count">
				<div v-show="friend.privetMessage.incoming.unread > 0">
					{{ friend.privetMessage.incoming.unread }}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "./chatFriendsList.scss";
</style>
