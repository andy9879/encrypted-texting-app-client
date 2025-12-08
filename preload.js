// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("manageFiles", {
	getUserData: (hash) => ipcRenderer.invoke("getUserData", hash),
	writeUserData: (data, hash) => ipcRenderer.invoke("writeUserData", data, hash),
	changeUsername: (username) => ipcRenderer.invoke("changeUsername", username),

	// we can also expose variables, not just functions
});
contextBridge.exposeInMainWorld("manageKeys", {
	hkdf: (input, info) => ipcRenderer.invoke("hkdf", input, info),
	encrypt: (hash, text) => ipcRenderer.invoke("encrypt", hash, text),
	decrypt: (hash, text) => ipcRenderer.invoke("decrypt", hash, text),
});

contextBridge.exposeInMainWorld("notification", {
	createNotification: (title, body) =>
		ipcRenderer.invoke("createNotification", title, body),
});
