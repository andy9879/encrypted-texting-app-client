<script setup>
import { ref } from "vue";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

import { useServerDataStore } from "@/stores/serverData";

import { useClientDataStore } from "@/stores/clientData";

let clientData = useClientDataStore();
</script>

<template>
	<div class="content">
		<h1>Friends</h1>
		<hr />
		<div class="friends">
			<div
				v-for="friend in clientData.data.friends"
				:key="friend.username"
				class="row"
			>
				<div class="col-1">
					<Suspense>
						<asyncProfilePicture :username="friend.username"></asyncProfilePicture>
						<!-- TODO Add betting loading screen -->
						<template #fallback> Loading... </template>
					</Suspense>
				</div>
				<div class="col-4">{{ friend.username }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./friends.scss";
</style>
