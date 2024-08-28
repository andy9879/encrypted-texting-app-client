<script setup>
import { ref } from "vue";
import { socket, socketGlobalListeners } from "@/scripts/socket";

socketGlobalListeners();

import { useServerDataStore } from "@/stores/serverData";

let serverData = useServerDataStore();

const searchQurry = ref("");

const showNoUserFound = ref(false);
const UserToAdd = ref({});

//TODO Add min username size to search
//TODO make no user found look better
function searchForUser() {
	socket.emit("findUser", searchQurry.value);
	socket.on("UserFound", (res) => {
		console.log(UserToAdd);
		if (res.found) {
			showNoUserFound.value = false;
			UserToAdd.value = res;
		} else {
			UserToAdd.value = {};
			showNoUserFound.value = true;
		}
	});
}

function sendFriendRequest(username) {
	socket.emit("FriendRequest", username);
}
</script>

<template>
	<div class="content">
		<div class="row">
			<div class="col-6">
				<div class="row">
					<div class="col">
						<h3>Add Friend</h3>
					</div>
				</div>
				<div class="row">
					<div class="col-8">
						<b-input v-model="searchQurry" class="textInput"></b-input>
					</div>
					<div @click="searchForUser()" class="col-4 buttonWrapper">
						<b-icon class="button" icon="search" width="50px" height="30px"></b-icon>
					</div>
				</div>
				<div class="row">
					<div class="col">
						<div class="UserNotFound" v-show="showNoUserFound">User not found</div>
						<div v-if="UserToAdd?.found" class="row userToAdd">
							<div col-4>
								<img
									class="userToAddIcon"
									:src="'data:image/png;base64,' + UserToAdd.profilePicture"
								/>
							</div>
							<div class="col-7">{{ UserToAdd.username }}</div>
							<div class="col-1">
								<b-icon
									@click="sendFriendRequest(UserToAdd.username)"
									sendFriendRequest
									class="userToAddAddIcon"
									icon="person-plus-fill"
								></b-icon>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="row">
					<div class="col">
						<h3>Pending Friend Requests</h3>

						<div class="row">
							<div class="col-2"></div>
							<div class="col-6">Username</div>
							<div class="col-4">Status</div>
						</div>
						<div>
							<div
								v-for="req in serverData.friendRequests.outgoing"
								:key="req.username"
							>
								<div class="row userToAdd">
									<div class="col-2">
										<img
											class="userToAddIcon"
											:src="'data:image/png;base64,' + req.profilePicture"
										/>
									</div>
									<div class="col-6">
										{{ req.username }}
									</div>

									<div class="col-4">Requested</div>
								</div>
							</div>
						</div>
						<div
							v-for="req in serverData.friendRequests.incoming"
							:key="req.username"
						>
							<div class="row userToAdd">
								<div class="col-2">
									<img
										class="userToAddIcon"
										:src="'data:image/png;base64,' + req.profilePicture"
									/>
								</div>
								<div class="col-6">
									{{ req.username }}
								</div>

								<div class="col-4">Pending</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./addFriend.scss";
</style>
