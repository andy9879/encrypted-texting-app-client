<script setup>
import { useServerDataStore } from "@/stores/serverData";

const props = defineProps(["username", "width", "height"]);

let serverData = useServerDataStore();

let imageSrc = await serverData.otherUserProfilePicture(props.username);
</script>

<template>
	<img
		class="profileIcon"
		:width="props.width ?? '48px'"
		:height="props.height ?? '48px'"
		:src="'data:image/png;base64,' + imageSrc"
	/>
</template>

<style scoped>
.profileIcon {
	border-radius: 10px;
}
</style>
