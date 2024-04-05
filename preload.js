// preload.js

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer } = require("electron");

// Expose specific Node.js modules or functions to the renderer process
contextBridge.exposeInMainWorld("electron", {
	// Expose methods or properties of the module
	fs: require("fs"),
});
