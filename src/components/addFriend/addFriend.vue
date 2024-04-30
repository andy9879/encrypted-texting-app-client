<script setup>
import { ref } from "vue";
import { socket } from "@/scripts/socket";

const searchQurry = ref("");

const showNoUserFound = ref(false);
const UserToAdd = ref({});

//TODO Add min username size to search
function searchForUser() {
	socket.emit("findUser", searchQurry.value);
	socket.on("UserFound", (res) => {
		if (res.found) {
			showNoUserFound.value = false;
			UserToAdd.value = res;
		} else {
			showNoUserFound.value = true;
		}
	});
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
						<div v-show="showNoUserFound">User not found</div>
						<div v-if="UserToAdd?.found" class="row userToAdd">
							<div col-4>
								<img
									class="userToAddIcon"
									height="50px"
									width="50px"
									:src="'data:image/png;base64,' + UserToAdd.profilePicture"
								/>
							</div>
							<div class="col-7">{{ UserToAdd.username }}</div>
							<div class="col-1">
								<b-icon class="userToAddAddIcon" icon="person-plus-fill"></b-icon>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="col-6">
				<div class="row">
					<div class="col">
						<h3>Pending Friend Requests</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./addFriend.scss";
</style>
