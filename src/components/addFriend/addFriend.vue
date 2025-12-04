<script setup>
import { ref, computed, defineProps, watch } from "vue";
import searchInput from "@/components/searchInput/searchInput.vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

import { useServerDataStore } from "@/stores/serverData";
import { findUser } from "@/scripts/serverApi";

let serverData = useServerDataStore();

const showNoUserFound = ref(false);
const UserToAdd = ref({});

const showFriendRequests = ref(true);

const showCancelSearch = ref(false);

//TODO style overflow scroll bar for friend requests

//TODO Add min username size to search
//TODO make no user found look better
//TODO Add Scroll bar for multiple search results for users
//TODO Add popups for sending, denying , and accepting friend requests
async function searchForUser(searchQuery) {
	let res = await findUser(searchQuery);
	showFriendRequests.value = false;
	showCancelSearch.value = true;

	if (res.found) {
		showNoUserFound.value = false;
		UserToAdd.value = res;
		UserToAdd.value.profilePicture = await serverData.otherUserProfilePicture(
			res.username,
		);
	} else {
		UserToAdd.value = {};
		showNoUserFound.value = true;
	}
}

async function cancelSearch() {
	showNoUserFound.value = false;
	showFriendRequests.value = true;
	showCancelSearch.value = false;
}

function sendFriendRequest(userId) {
	socket.emit("FriendRequest", userId);
	showFriendRequests.value = true;
	showCancelSearch.value = false;
}

function acceptFriendRequest(userId) {
	socket.emit("acceptFriendRequest", userId);
}

function cancelFriendRequest(userId) {
	socket.emit("cancelFriendRequest", userId);
}

const friendRequests = computed(() => {
	return serverData.friendRequests.incoming
		.map((friendRequest) => {
			return {
				...friendRequest,
				type: "incoming",
			};
		})
		.concat(
			serverData.friendRequests.outgoing.map((friendRequest) => {
				return {
					...friendRequest,
					type: "outgoing",
				};
			}),
		);
});
</script>

<template>
	<div class="content">
		<div>
			<searchInput
				:show-cancel="showCancelSearch"
				:cancel="cancelSearch"
				:search="searchForUser"
			/>
		</div>
		<div v-show="!showFriendRequests">
			<div class="row">
				<div class="col">
					<div class="UserNotFound" v-show="showNoUserFound">User not found</div>
					<div v-if="UserToAdd?.found" class="row userToAdd">
						<div col-4>
							<!-- TODO switch profile pics to async component with suspense -->
							<img class="userToAddIcon" :src="UserToAdd.profilePicture" />
						</div>
						<div class="col-7">{{ UserToAdd.username }}</div>
						<div class="col-1">
							<b-icon
								@click="sendFriendRequest(UserToAdd.id)"
								icon="person-plus-fill"
								class="addControlIcon"
								scale="2"
							></b-icon>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="requestListWrapper" v-show="showFriendRequests">
			<div v-for="req in friendRequests" :key="req.username">
				<div class="userToAdd">
					<div>
						<img class="userToAddIcon" :src="req.profilePicture" />
					</div>
					<div class="userToAddUsername">
						{{ req.username }}
					</div>

					<b-icon
						v-if="req.type === 'incoming'"
						style="margin-right: 0.3cm"
						class="addControlIcon"
						scale="2"
						icon="check"
						@click="acceptFriendRequest(req.id)"
					></b-icon>

					<b-icon
						@click="cancelFriendRequest(req.id)"
						scale="2"
						class="addControlIcon"
						icon="x"
					></b-icon>
				</div>
			</div>
			<div v-if="friendRequests.length === 0">No Friend Requests ):</div>
		</div>
	</div>
</template>

<style scoped>
@import "./addFriend.scss";
</style>
