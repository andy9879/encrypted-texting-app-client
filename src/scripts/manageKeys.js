import { addKeyBundle } from "./serverApi";
import { useClientDataStore } from "@/stores/clientData";
import { v4 as uuid } from "uuid";
import { requestPreKeyBundle as requestPreKeyBundleReq } from "@/scripts/serverApi.js";

export async function createKeyPair() {
	return await window.manageKeys.createKeyPair();
}

export async function signKey(pub, priv) {
	//TODO Hash pub key before siging
	return await window.manageKeys.signKey(pub, priv);
}

export async function getSharedSecret(pub, priv) {
	return await window.manageKeys.getSharedSecret(pub, priv);
}

export async function verifySig(sig, signedContent, pub) {
	return await window.manageKeys.verifySig(sig, signedContent, pub);
}

export async function hkdf(input, info) {
	return await window.manageKeys.hkdf(input, info);
}

export async function checkPreKeyBundles() {
	let clientData = useClientDataStore();

	let amountOfOneTimeKeys = Object.keys(clientData.data.keyBundles);

	if (amountOfOneTimeKeys > 1000) return;

	let keyBundle = [];

	for (let i = 0; i < 100; i++) {
		let key = await window.manageKeys.createKeyPair();
		keyBundle.push({
			...key,
			id: uuid(),
			iss: Date.now(),
		});
	}

	keyBundle.forEach((key) => {
		clientData.data.keyBundles[key.id] = key;
	});

	clientData.writeData();

	let pubKeyBundle = JSON.parse(JSON.stringify(keyBundle));

	pubKeyBundle = pubKeyBundle.map((key) => {
		delete key.priv;
		delete key.iss;
		return key;
	});

	addKeyBundle(pubKeyBundle);
}

export async function requestPreKeyBundle(userId) {
	let req = await requestPreKeyBundleReq(userId);
	if (req.status !== "successful") return null;

	let bundle = req.bundle;
}
