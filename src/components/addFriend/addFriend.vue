<script setup>
import { ref } from "vue";
import { socket } from "@/scripts/socket";

const searchQurry = ref("");

//TODO Add min username size to search
function searchForUser() {
	socket.emit("findUser", searchQurry.value);
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
						<b-input class="textInput"></b-input>
					</div>
					<div class="col-4 buttonWrapper">
						<b-icon class="button" icon="search" width="50px" height="30px"></b-icon>
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
