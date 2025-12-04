<script setup>
import { ref } from "vue";
import addFriend from "@/components/addFriend/addFriend.vue";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

let serverData = useServerDataStore();
let clientData = useClientDataStore();

let showAddFriend = ref(false);
let showAddFriendFirstLoad = ref(true);

function toggle() {
	showAddFriend.value = !showAddFriend.value;
	showAddFriendFirstLoad.value = false;
}
</script>

<template>
	<div ref="profileInfo" class="wrapper">
		<div
			v-show="!showAddFriendFirstLoad"
			:class="[
				'addFriend',
				'animate__animated',
				'animate__faster',
				{ ['animate__backOutDown']: !showAddFriend && !showAddFriendFirstLoad },
				{ ['animate__backInUp']: showAddFriend },
			]"
		>
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
