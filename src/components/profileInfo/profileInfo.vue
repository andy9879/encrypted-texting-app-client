<script setup>
import { ref } from "vue";
import addFriend from "../chat-pages/addFriend/addFriend.vue";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

let serverData = useServerDataStore();
let clientData = useClientDataStore();

let showAddFriend = ref(false);

function toggle() {
	showAddFriend.value = !showAddFriend.value;
}
</script>

<template>
	<div ref="profileInfo" class="wrapper">
		<div v-show="showAddFriend" class="addFriend">
			<add-friend />
		</div>
		<div class="profilePicture">
			<Suspense>
				<asyncProfilePicture
					:username="clientData.data.username"
					width="48px"
					height="48px"
				/>
				<template #fallback> Loading... </template>
			</Suspense>
		</div>
		<div class="ProfileInfoAndControls">
			<div>
				{{ clientData.data.username }}
			</div>
			<div class="controls">
				<span @click="toggle()" class="pi pi-user-plus"></span>
				<RouterLink to="/settings/">
					<span class="pi pi-cog"></span>
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./profileInfo.scss";
</style>
