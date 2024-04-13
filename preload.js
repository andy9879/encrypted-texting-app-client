// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("manageFiles", {
	getUserData: (hash) => {
		debugger;
		return ipcRenderer.invoke("getUserData", hash);
	},
	writeUserData: (data, hash) => {
		debugger;
		console.log(data);
		console.log(hash);
		debugger;
		ipcRenderer.invoke("writeUserData", data, hash);
	},
	// we can also expose variables, not just functions
});
