// stores/counter.js
import { defineStore } from "pinia";
import { url } from "@/scripts/socket";

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
				let res = await fetch(`${url}/profilePicture/${username}/`);
				let picture = res.text();
				this.otherUsersProfilePictures[username] = picture;
				return picture;
			} else {
				return this.otherUsersProfilePictures[username];
			}
		},
	},
});
