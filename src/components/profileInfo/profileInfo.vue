<script setup>
import { ref, watch } from "vue";
import addFriend from "@/components/addFriend/addFriend.vue";
import asyncProfilePicture from "@/components/asyncProfilePicture/asyncProfilePicture.vue";

import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";

let serverData = useServerDataStore();
let clientData = useClientDataStore();

let showAddFriend = ref(false);
let showAddFriendFirstLoad = ref(true);
let enableClickOutsideToCloseAddFriend = ref(false);

function toggleAddFriend() {
	showAddFriend.value = !showAddFriend.value;
	showAddFriendFirstLoad.value = false;
}

function closeAddFriend() {
	if (enableClickOutsideToCloseAddFriend.value && showAddFriend.value) {
		showAddFriend.value = false;
	}
}

watch(showAddFriend, () => {
	setTimeout(() => {
		enableClickOutsideToCloseAddFriend.value =
			!enableClickOutsideToCloseAddFriend.value;
	}, 200);
});
</script>

<template>
	<div ref="profileInfo" class="wrapper">
		<div
			v-click-outside-element="closeAddFriend"
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
				<span @click="toggleAddFriend()" class="pi pi-user-plus"></span>
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
