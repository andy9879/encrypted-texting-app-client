// stores/counter.js
import { defineStore } from "pinia";

export const useServerDataStore = defineStore("ServerDataStore", {
	state: () => ({
		profilePicture: "",
		friendRequests: {
			incoming: [],
			outgoing: [],
		},
		incomingMessages: [],
	}),
});
