// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { encode } = require("node:punycode");
const fs = require("fs");

require("dotenv").config();

if (process.env.ignoreCertificate) {
	app.commandLine.appendSwitch("ignore-certificate-errors");
}

let dataPath = null;

if (process.env.localData) {
	dataPath = __dirname;
} else {
	dataPath = app.getPath("userData");
}

if (!fs.existsSync(dataPath)) {
	fs.mkdirSync(dataPath);
}

dataPath = path.join(dataPath, "userData.json");

//TODO Encript user data

function getUserData() {
	if (fs.existsSync(dataPath)) {
		return fs.readFileSync(dataPath, {
			encoding: "utf-8",
			flag: "r",
		});
	} else {
		return null;
	}
}

function writeUserData(data) {
	fs.writeFileSync(dataPath, JSON.stringify(data), {
		flag: "w",
	});
}

const createWindow = () => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minHeight: 800,
		minWidth: 1200,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	// and load the index.html of the app.
	mainWindow.loadFile("./dist/index.html");

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	ipcMain.handle("getUserData", getUserData);
	ipcMain.handle("writeUserData", writeUserData);
	createWindow();

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
