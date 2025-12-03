<script setup>
import { useServerDataStore } from "@/stores/serverData";
import { useClientDataStore } from "@/stores/clientData";
import router from "@/router";
import { socket } from "@/scripts/socket.js";
import { useTemplateRef, ref } from "vue";

let serverData = useServerDataStore();
let clientData = useClientDataStore();
function logout() {
	//TODO FIx stores not resetting
	serverData.$reset();
	clientData.$reset();
	socket.disconnect();
	socket.io.opts.extraHeaders.authorization = "";

	router.push("/");
}

const newProfilePicture = useTemplateRef("pfp");

const profilePictureExample = ref("");

// Source - https://stackoverflow.com/a
// Posted by Dmitry Vasilev, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-03, License - CC BY-SA 4.0

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
	});

async function upload() {
	const file = newProfilePicture.value.files[0];
	profilePictureExample.value = await toBase64(file);
	console.log(await toBase64(file));
	socket.emit("changeProfilePicture", profilePictureExample.value);
	serverData.profilePicture = profilePictureExample.value;
}
</script>

<template>
	<button @click="logout()">Logout</button>
	<RouterLink to="/chat/">
		<button>Back</button>
	</RouterLink>
	<br />
	<input
		ref="pfp"
		type="file"
		id="avatar"
		name="avatar"
		accept="image/png, image/jpeg"
	/>
	<button @click="upload()">Upload</button>
	<br />
	<img class="userToAddIcon" :src="profilePictureExample" />
</template>

<style scoped>
@import "settings.scss";
</style>
