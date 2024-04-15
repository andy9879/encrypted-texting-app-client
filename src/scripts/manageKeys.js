import { user } from "./manageFiles";
import { socket } from "./socket";

export async function createKeyPair() {
	return await window.manageKeys.createKeyPair();
}

export async function checkPreKeyBundles() {
	let ammountOfOneTimeKeys = 0;
	debugger;

	user.data.keyBundles.forEach((bundle) => {
		ammountOfOneTimeKeys += bundle.ok.length;
	});

	if (ammountOfOneTimeKeys > 10000) return;

	let keyBundle = {
		sk: await window.manageKeys.createKeyPair(),
		ok: [],
	};

	keyBundle.sig = await window.manageKeys.signKey(
		keyBundle.sk.pub,
		keyBundle.sk.priv
	);

	for (let i = 0; i < 1000; i++) {
		let key = await window.manageKeys.createKeyPair();
		keyBundle.ok.push(key);
	}

	user.data.keyBundles.push(keyBundle);

	let pubKeyBundle = JSON.parse(JSON.stringify(keyBundle));

	pubKeyBundle.sk.priv = undefined;

	pubKeyBundle.ok = pubKeyBundle.ok.map((key) => {
		key.priv = undefined;
		return key;
	});

	socket.emit("addKeyBundle", pubKeyBundle);
}
