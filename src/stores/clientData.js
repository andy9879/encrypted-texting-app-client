// stores/counter.js
import { defineStore } from "pinia";

export const useClientDataStore = defineStore("ClientDataStore", {
	state: () => ({
		passwordHash: "",
		data: {
			servers: [
				{
					channels: [
						{
							messages: [],
							channels: "id",
							safetyKeyPos: 0,
							users: [
								{
									username: "",
									publicKeyPos: 0,
									secrets: {
										receiving: "",
										sending: "",
									},
									id: 0,
								},
							],
							pendingAddingUsers: {},
						},
					],
					users: [
						{
							username: "name",
							usernameHash: "",
						},
					],
				},
			],
			contacts: [
				[
					{
						username: "",
						secrets: {
							receiving: "",
							sending: "",
						},
						id: 0,
						safetyKeyPos: 0,
					},
				],
			],
			pendingMessages: [
				{
					username: "",
					destination: "",
					id: 0,
				},
			],
			friends: [],
			iK: {},
			sK: {},
			keyBundles: {},
			id: null,
		},
	}),
	actions: {
		async loadData() {
			this.data = await window.manageFiles.getUserData(this.passwdHash);
		},
		async writeData() {
			window.manageFiles.writeUserData(
				JSON.parse(JSON.stringify(this.data)),
				this.passwdHash,
			);
		},
		async changeUsername(username) {
			await window.manageFiles.changeUsername(username);
		},
	},
});
