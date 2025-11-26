// stores/counter.js
import { defineStore } from "pinia";
import { getUserProfilePic } from "@/scripts/serverApi";

export const useServerDataStore = defineStore("ServerDataStore", {
	state: () => ({
		profilePicture: "",
		friendRequests: {
			incoming: [],
			outgoing: [],
		},
		incomingMessages: [],
		otherUsersProfilePictures: {},
	}),
	actions: {
		async otherUserProfilePicture(username) {
			if (this.otherUsersProfilePictures[username] == undefined) {
				let picture = await getUserProfilePic(username);
				this.otherUsersProfilePictures[username] = picture;
				return picture;
			} else {
				return this.otherUsersProfilePictures[username];
			}
		},
	},
});
