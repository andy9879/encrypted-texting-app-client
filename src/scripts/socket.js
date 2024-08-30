import { io } from "socket.io-client";

import { useServerDataStore } from "@/stores/serverData";

import { user } from "@/scripts/manageFiles";

let socketInstance = null;

let serverUrl = null;

export function socketInit(url, port) {
	socketInstance = io(url + ":" + port);
	serverUrl = url + ":" + port;
}

export function socketGlobalListeners() {
	let serverData = useServerDataStore();
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
				user.data.friends.findIndex(
					(clientFriend) => clientFriend.username == friend.username
				) < 0
			) {
				user.data.friends.push(friend);
			}
		});

		user.writeData();

		console.log("Updated Friends");
	});
}

export { socketInstance as socket };

export { serverUrl as url };
