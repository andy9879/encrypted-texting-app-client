import { io } from "socket.io-client";

import { useServerDataStore } from "@/stores/serverData";

let socketInstance = null;

export function socketInit(url, port) {
	socketInstance = io(url + ":" + port);
}

export function socketGlobalListeners() {
	let serverData = useServerDataStore();
	let socket = socketInstance;

	socket.on("friendRequest", (req) => {
		console.log("Received Friend Request");
		serverData.friendRequests["incoming"].push({
			username: req.username,
			profilePicture: req.profilePicture,
		});
	});
}

export { socketInstance as socket };
