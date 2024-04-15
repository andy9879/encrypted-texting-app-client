// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { encode } = require("node:punycode");
const fs = require("fs");
const {
	createHash,
	createCipheriv,
	createDecipheriv,
	randomFillSync,
	constants,
} = require("crypto");

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

//TODO Upgrade Hash

function getUserData(event, hash) {
	return new Promise((resolve) => {
		if (fs.existsSync(dataPath)) {
			let key = Buffer.from(hash, "hex");

			let encriptedDataArr = fs
				.readFileSync(dataPath, {
					encoding: "utf-8",
					flag: "r",
				})
				.split(":");

			let iv = Buffer.from(encriptedDataArr[0], "base64");
			let encrypted = encriptedDataArr[1];

			const decipher = createDecipheriv("aes-256-cbc", key, iv);

			let decrypted = "";

			decipher.on("readable", () => {
				let chunk;
				while (null !== (chunk = decipher.read())) {
					decrypted += chunk.toString("utf8");
				}
			});

			decipher.on("end", () => {
				resolve(JSON.parse(decrypted));
				// Prints: some clear text data
			});

			decipher.write(encrypted, "base64");
			decipher.end();
		} else {
			return null;
		}
	});
}

function writeUserData(event, data, hash) {
	let key = Buffer.from(hash, "hex");

	let iv = Buffer.alloc(16);
	iv = randomFillSync(iv);

	const cipher = createCipheriv("aes-256-cbc", key, iv);

	let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");

	encrypted += cipher.final("base64");

	encrypted = iv.toString("base64") + ":" + encrypted;

	fs.writeFileSync(dataPath, encrypted, {
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
