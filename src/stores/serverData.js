// stores/counter.js
import { defineStore } from "pinia";
import { getUserProfilePic } from "@/scripts/serverApi";
import getStream from "get-stream";

import { useClientDataStore } from "./clientData";

export const useServerDataStore = defineStore("ServerDataStore", {
	state: () => ({
		profilePicture: "",
		friendRequests: {
			incoming: [],
			outgoing: [],
		},
		incomingMessages: [],
		otherUsersProfilePictures: {},
		refreshToken: null,
		jwt: null,
	}),
	actions: {
		async otherUserProfilePicture(username) {
			let clientData = useClientDataStore();
			if (clientData.data.username === username) {
				return this.profilePicture;
			} else if (this.otherUsersProfilePictures[username] == undefined) {
				let stream = await getUserProfilePic(username);
				let picture = await getStream(stream);
				this.otherUsersProfilePictures[username] = picture;
				return picture;
			} else {
				return this.otherUsersProfilePictures[username];
			}
		},
	},
});
