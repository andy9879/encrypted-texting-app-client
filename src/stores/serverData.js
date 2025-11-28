// stores/counter.js
import { defineStore } from "pinia";
import { getUserProfilePic } from "@/scripts/serverApi";
import getStream from "get-stream";

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
			let time = new Promise((resolve) => {
				setTimeout(() => {
					resolve();
				}, 5000);
			});

			await time;

			if (this.otherUsersProfilePictures[username] == undefined) {
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
