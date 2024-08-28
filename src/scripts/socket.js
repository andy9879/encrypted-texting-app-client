import { io } from "socket.io-client";

import { useServerDataStore } from "@/stores/serverData";

let socketInstance = null;

export function socketInit(url, port) {
	socketInstance = io(url + ":" + port);
}

export function socketGlobalListeners() {
	let serverData = useServerDataStore();
	let socket = socketInstance;

	socket.on("friendRequestUpdate", (req) => {
		console.log("Received Friend Request Update");
		serverData.friendRequests = req;
	});
}

export { socketInstance as socket };
