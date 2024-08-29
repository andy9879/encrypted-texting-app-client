import { io } from "socket.io-client";

import { useServerDataStore } from "@/stores/serverData";

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
}

export { socketInstance as socket };

export { serverUrl as url };
