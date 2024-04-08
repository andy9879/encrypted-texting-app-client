import { io } from "socket.io-client";

let socketInstance = null;

export function socketInit(url, port) {
	socketInstance = io(url + ":" + port);
}

export { socketInstance as socket };
