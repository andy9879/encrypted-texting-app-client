// stores/counter.js
import { defineStore } from "pinia";
import { socket } from "@/scripts/socket";

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
			keyBundles: [],
		},
	}),
	actions: {
		async loadData() {
			this.data = await window.manageFiles.getUserData(this.passwdHash);
		},
		async writeData() {
			window.manageFiles.writeUserData(this.data, this.passwdHash);
		},
		async changeUsername(username) {
			await window.manageFiles.changeUsername(username);
		},
		async checkPreKeyBundles() {
			let ammountOfOneTimeKeys = 0;

			this.data.keyBundles.forEach((bundle) => {
				ammountOfOneTimeKeys += bundle.ok.length;
			});

			if (ammountOfOneTimeKeys > 10000) return;

			let keyBundle = {
				sk: await window.manageKeys.createKeyPair(),
				ok: [],
			};

			keyBundle.sig = await window.manageKeys.signKey(
				keyBundle.sk.pub,
				keyBundle.sk.priv
			);

			for (let i = 0; i < 1000; i++) {
				let key = await window.manageKeys.createKeyPair();
				keyBundle.ok.push(key);
			}

			this.data.keyBundles.push(keyBundle);
			this.writeData();

			let pubKeyBundle = JSON.parse(JSON.stringify(keyBundle));

			pubKeyBundle.sk.priv = undefined;

			pubKeyBundle.ok = pubKeyBundle.ok.map((key) => {
				key.priv = undefined;
				return key;
			});

			socket.emit("addKeyBundle", pubKeyBundle);
		},
		async createKeyPair() {
			return await window.manageKeys.createKeyPair();
		},
	},
});
