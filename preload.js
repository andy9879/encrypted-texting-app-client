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
	createKeyPair: () => ipcRenderer.invoke("createKeyPair"),
	signKey: (pub, priv) => ipcRenderer.invoke("signKey", pub, priv),
});

contextBridge.exposeInMainWorld("notification", {
	createNotification: (title, body) =>
		ipcRenderer.invoke("createNotification", title, body),
});
