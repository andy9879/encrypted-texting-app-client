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
	getters: {
		//TODO add expiration to userProfile Pictures
		otherUserProfilePicture: (state) => {
			return async function (username) {
				if (state.otherUsersProfilePictures[username] == undefined) {
					let res = await fetch(`${url}/profilePicture/${username}/`);
					let picture = res.text();
					state.otherUsersProfilePictures[username] = picture;
					return picture;
				} else {
					return state.otherUsersProfilePictures[username];
				}
			};
		},
	},
});
