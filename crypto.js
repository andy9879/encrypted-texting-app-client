const crypto = require("crypto");

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: "pkcs1",
		format: "pem",
	},
	privateKeyEncoding: {
		type: "pkcs1",
		format: "pem",
	},
});

// Example data to encrypt
const plaintext = "Hello, World!";

// Encrypt with private key
let encryptedData = crypto.privateEncrypt(
	{
		key: privateKey,
		padding: crypto.constants.RSA_PKCS1_PADDING,
	},
	Buffer.from(plaintext, "utf-8")
);

console.log("Public Encrypted:", encryptedData.toString("base64"));

// Decrypt with public key
let decryptedData = crypto.publicDecrypt(
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_PADDING,
	},
	encryptedData
);

console.log("public Decrypted:", decryptedData.toString("utf-8"));

encryptedData = crypto.publicEncrypt(
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	},
	Buffer.from(plaintext, "utf-8")
);

console.log("private Encrypted:", encryptedData.toString("base64"));

// Decrypt with private key
decryptedData = crypto.privateDecrypt(
	{
		key: privateKey,
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	},
	encryptedData
);

console.log("private Decrypted:", decryptedData.toString("utf-8"));
