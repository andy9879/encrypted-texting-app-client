import { io } from "socket.io-client";

import { useServerDataStore } from "@/stores/serverData";
let serverData = useServerDataStore();

import { useClientDataStore } from "@/stores/clientData";
let clientData = useClientDataStore();

let socketInstance = null;

let serverUrl = null;

export function socketInit(url, port) {
	socketInstance = io(url + ":" + port);
	serverUrl = url + ":" + port;
}

export function socketGlobalListeners() {
	let socket = socketInstance;

	socket.on("friendRequestUpdate", async (req) => {
		console.log("Received Friend Request Update");

		for (let type in req) {
			for (let request of req[type]) {
				request.profilePicture = await serverData.otherUserProfilePicture(
					request.username
				);
			}
		}

		serverData.friendRequests = req;
	});

	//TODO add some way to reset friend to allow a ik change with a warning or something
	socket.on("updateFriends", async (friends) => {
		serverData.friends = friends;

		friends.forEach((friend) => {
			if (
				clientData.data.friends.findIndex(
					(clientFriend) => clientFriend.username == friend.username
				) < 0
			) {
				clientData.data.friends.push(friend);
			}
		});

		clientData.writeData();

		console.log("Updated Friends");
	});
}

export { socketInstance as socket };

export { serverUrl as url };
