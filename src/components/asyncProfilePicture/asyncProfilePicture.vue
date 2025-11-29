<script setup>
import { useServerDataStore } from "@/stores/serverData";

const props = defineProps(["username"]);

let serverData = useServerDataStore();

let imageSrc = await serverData.otherUserProfilePicture(props.username);
</script>

<template>
	<img width="64px" height="64px" :src="'data:image/png;base64,' + imageSrc" />
</template>

<style scoped></style>
