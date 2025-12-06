// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("node:path");
const { encode } = require("node:punycode");
const fs = require("fs");
const {
	createHash,
	createCipheriv,
	createDecipheriv,
	randomFillSync,
	constants,
	hkdfSync,
} = require("crypto");

let { secp256k1 } = require("@noble/curves/secp256k1");
const { Base64 } = require("js-base64");

//TODO make dotenv files only included in building
require("dotenv").config();

if (process.env.ignoreCertificate) {
	app.commandLine.appendSwitch("ignore-certificate-errors");
}

let dataPath = null;

if (process.env.localData) {
	dataPath = path.join(__dirname, "userData");
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
			if (process.env.NoEncryptData) {
				resolve(
					JSON.parse(fs.readFileSync(dataPath, { flag: "r", encoding: "utf-8" })),
				);
				return;
			}

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

	fs.writeFileSync(
		dataPath,
		!process.env.NoEncryptData ? encrypted : JSON.stringify(data),
		{
			flag: "w",
		},
	);
}

function changeUsername(event, username) {
	//TODO make sure special chars are not allowed in user names
	dataPath =
		dataPath.replaceAll(/[^\\\/]*?\.json/gi, "") +
		"userData-" +
		username.replaceAll("/", "") +
		".json";
}

function createKeyPair() {
	//TODO Check on deprecated function
	let priv = secp256k1.utils.randomPrivateKey();
	let pub = secp256k1.getPublicKey(priv);
	return {
		priv: Base64.fromUint8Array(priv),
		pub: Base64.fromUint8Array(pub),
	};
}

function signKey(event, pub, priv) {
	let sig = secp256k1.sign(Base64.toUint8Array(pub), Base64.toUint8Array(priv));

	return {
		r: "0x" + sig.r.toString(16),
		s: "0x" + sig.s.toString(16),
	};
}

function getSharedSecret(event, priv, pub) {
	let intPriv = Base64.toUint8Array(priv);
	let intPub = Base64.toUint8Array(pub);

	return Base64.fromUint8Array(secp256k1.getSharedSecret(intPriv, intPub));
}

function verifySig(event, sig, signedContent, pub) {
	return secp256k1.verify(
		{
			r: BigInt(sig.r),
			s: BigInt(sig.s),
		},
		Base64.toUint8Array(signedContent),
		Base64.toUint8Array(pub),
	);
}

function hkdf(event, input, info) {
	let secret = Base64.toUint8Array(input);
	return Base64.fromUint8Array(
		new Uint8Array(hkdfSync("sha256", secret, "", info, 32)),
	);
}

function encrypt(event, hash, text) {
	let key = Base64.toUint8Array(hash);

	let iv = Buffer.alloc(16);
	iv = new Uint8Array(randomFillSync(iv));

	const cipher = createCipheriv("aes-256-cbc", key, iv);

	let encrypted = cipher.update(text, "utf8", "base64");

	encrypted += cipher.final("base64");

	return (encrypted = Base64.fromUint8Array(iv) + ":" + encrypted);
}

function decrypt(event, hash, text) {
	return new Promise((resolve) => {
		let key = Base64.toUint8Array(hash);

		let encriptedDataArr = text.split(":");

		let iv = Base64.toUint8Array(encriptedDataArr[0]);
		let encrypted = encriptedDataArr[1];

		const decipher = createDecipheriv("aes-256-cbc", key, iv);

		let decrypted = "";

		decipher.on("readable", () => {
			let chunk;
			while (null !== (chunk = decipher.read())) {
				decrypted += chunk.toString("utf8");
			}
		});

		decipher.write(encrypted, "base64");
		decipher.end();

		decipher.on("end", () => {
			resolve(decrypted);
		});
	});
}

function createNotification(event, title, body) {
	console.log("notification");
	new Notification({
		title: title,
		body: body,
	}).show();
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
	ipcMain.handle("createKeyPair", createKeyPair);
	ipcMain.handle("changeUsername", changeUsername);
	ipcMain.handle("signKey", signKey);
	ipcMain.handle("getSharedSecret", getSharedSecret);
	ipcMain.handle("verifySig", verifySig);
	ipcMain.handle("createNotification", createNotification);
	ipcMain.handle("hkdf", hkdf);
	ipcMain.handle("encrypt", encrypt);
	ipcMain.handle("decrypt", decrypt);
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
