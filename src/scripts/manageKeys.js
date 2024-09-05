import { socket } from "./socket";
import { useClientDataStore } from "@/stores/clientData";
let clientData = useClientDataStore();

export async function createKeyPair() {
	return await window.manageKeys.createKeyPair();
}

export async function checkPreKeyBundles() {
	let ammountOfOneTimeKeys = 0;

	clientData.data.keyBundles.forEach((bundle) => {
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

	clientData.data.keyBundles.push(keyBundle);
	clientData.writeData();

	let pubKeyBundle = JSON.parse(JSON.stringify(keyBundle));

	pubKeyBundle.sk.priv = undefined;

	pubKeyBundle.ok = pubKeyBundle.ok.map((key) => {
		key.priv = undefined;
		return key;
	});

	socket.emit("addKeyBundle", pubKeyBundle);
}
