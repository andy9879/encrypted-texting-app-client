// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("manageFiles", {
	getUserData: (hash) => ipcRenderer.invoke("getUserData"),
	writeUserData: (data, hash) => ipcRenderer.invoke("writeUserData", data, hash),
	// we can also expose variables, not just functions
});
