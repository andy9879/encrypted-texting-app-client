import { io } from "socket.io-client";

import { useClientDataStore } from "@/stores/clientData";

import { useServerDataStore } from "@/stores/serverData";

import { url, port } from "@/scripts/serverApi";

import { getSharedSecret, hkdf, decrypt } from "@/scripts/manageKeys";

let socketInstance = null;

function socketGlobalListeners() {
	let clientData = useClientDataStore();
	let serverData = useServerDataStore();
	let socket = socketInstance;

	socket.on("friendRequestUpdate", async (req) => {
		console.log("Received Friend Request Update");

		let res = JSON.parse(JSON.stringify(req));

		for (let type in req) {
			for (let request of req[type]) {
				request.profilePicture = await serverData.otherUserProfilePicture(
					request.username,
				);
			}
		}

		serverData.friendRequests = req;

		socket.emit("friendRequestUpdateRes", res);
	});

	//TODO add some way to reset friend to allow a ik change with a warning or something
	socket.on("updateFriends", async (friends) => {
		serverData.friends = friends;

		friends.forEach((friend) => {
			if (
				clientData.data.friends.findIndex(
					(clientFriend) => clientFriend.username == friend.username,
				) < 0
			) {
				clientData.data.friends.push({
					...friend,
					privetMessage: {
						incoming: {
							messages: [],
							decryptedMessageIds: [],
						},
						outgoing: {
							messages: [],
						},
					},
				});
			}
		});

		clientData.writeData();

		socket.emit(
			"receivedFriendUpdate",
			friends.map((friend) => friend.id),
		);

		console.log("Updated Friends");
	});

	socket.on("PrivateMessagesUpdate", async (messages) => {
		let user = clientData.data;
		let friends = user.friends;

		messages.forEach(async (message) => {
			let friend = friends.find((friend) => friend.id === message.from);

			if (friend === undefined) return;

			let incoming = friend.privetMessage.incoming;

			if (incoming.decryptedMessageIds.includes(message.id)) return;

			let oK = user.keyBundles[message.oKId];

			let secret = null;

			let sharedSecretArr = await Promise.all([
				getSharedSecret(user.iK.priv, message.eK),
				getSharedSecret(user.sK.priv, friend.iK),
				getSharedSecret(user.sK.priv, message.eK),
				getSharedSecret(oK.priv, message.eK),
			]);

			secret = await hkdf(
				sharedSecretArr.reduce((newSecret, secret) => {
					return newSecret + secret;
				}),
				oK.id,
			);

			incoming.decryptedMessageIds.push(message.id);

			let text = await decrypt(secret, message.encryptedText);

			console.log(secret);
			console.log(text);

			clientData.writeData();
		});
	});
}

function updateAll() {
	socketInstance.emit("updateAllRequest");
}

export function socketInit() {
	let serverData = useServerDataStore();

	socketInstance = io("https://" + url + ":" + port, {
		extraHeaders: {
			authorization: `bearer ${serverData.jwt}`,
		},
	});

	socketGlobalListeners();
	updateAll();
}

export function refreshTokenHeader(newToken) {
	socketInstance.io.opts.extraHeaders.authorization = `bearer ${newToken}`;
	socketInstance.disconnect();
	socketInstance.connect();
	updateAll();
}

export { socketInstance as socket };
