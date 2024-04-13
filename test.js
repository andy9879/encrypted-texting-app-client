const {
	scrypt,
	randomFill,
	createCipheriv,
	scryptSync,
	createDecipheriv,
	randomFillSync,
} = require("node:crypto");

const sha256 = require("sha256");

const algorithm = "aes-256-cbc";
const password = sha256("Password used to generate key");

// First, we'll generate the key. The key length is dependent on the algorithm.
// In this case for aes192, it is 24 bytes (192 bits).
let key = Buffer.from(password, "hex");
// Then, we'll generate a random initialization vector

let iv = Buffer.alloc(16);
console.log(iv);
iv = randomFillSync(iv).toString("base64");

console.log(iv);

iv = Buffer.from(iv, "base64");

const cipher = createCipheriv(algorithm, key, iv);

let encrypted = cipher.update(
	"some clear text dlkjljlkjkkkkkkkkkkkkkkkkkkkkkkkkkkklkjlkjljkata",
	"utf8",
	"base64"
);

encrypted += cipher.final("base64");

encrypted = iv + ":" + encrypted;
console.log(encrypted);

// const key = scryptSync(password, 'salt', 24);
// The IV is usually passed along with the ciphertext.
// Initialization vector.

const decipher = createDecipheriv(algorithm, key, iv);

let decrypted = "";
encrypted = encrypted.split(":")[1];
decipher.on("readable", () => {
	let chunk;
	while (null !== (chunk = decipher.read())) {
		decrypted += chunk.toString("utf8");
	}
});
decipher.on("end", () => {
	console.log(decrypted);
	// Prints: some clear text data
});

// Encrypted with same algorithm, key and iv.

decipher.write(encrypted, "hex");
decipher.end();
