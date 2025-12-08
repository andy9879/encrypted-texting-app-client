import { secp256k1 } from "@noble/curves/secp256k1";
import { Base64 } from "js-base64";
import scrypt from "scrypt-js";
import { addKeyBundle } from "./serverApi";
import { useClientDataStore } from "@/stores/clientData";
import { v4 as uuid } from "uuid";
import { requestPreKeyBundle as requestPreKeyBundleReq } from "@/scripts/serverApi.js";

export async function createKeyPair() {
	//TODO Check on deprecated function
	let priv = secp256k1.utils.randomPrivateKey();
	let pub = secp256k1.getPublicKey(priv);
	return {
		priv: Base64.fromUint8Array(priv),
		pub: Base64.fromUint8Array(pub),
	};
}

export async function signKey(pub, priv) {
	//TODO Hash pub key before siging
	let sig = secp256k1.sign(Base64.toUint8Array(pub), Base64.toUint8Array(priv));

	return {
		r: "0x" + sig.r.toString(16),
		s: "0x" + sig.s.toString(16),
	};
}

export async function getSharedSecret(priv, pub) {
	let intPriv = Base64.toUint8Array(priv);
	let intPub = Base64.toUint8Array(pub);

	return Base64.fromUint8Array(secp256k1.getSharedSecret(intPriv, intPub));
}

export async function verifySig(sig, signedContent, pub) {
	return secp256k1.verify(
		{
			r: BigInt(sig.r),
			s: BigInt(sig.s),
		},
		Base64.toUint8Array(signedContent),
		Base64.toUint8Array(pub),
	);
}

export async function hkdf(input, info) {
	let uintHash = await scrypt.scrypt(
		Base64.toUint8Array(input),
		Base64.toUint8Array(info),
		128,
		8,
		4,
		32,
	);

	return Base64.fromUint8Array(uintHash);
}

export async function encrypt(hash, text) {
	return await window.manageKeys.encrypt(hash, text);
}

export async function decrypt(hash, text) {
	return await window.manageKeys.decrypt(hash, text);
}

export async function checkPreKeyBundles() {
	let clientData = useClientDataStore();

	let amountOfOneTimeKeys = Object.keys(clientData.data.keyBundles);

	if (amountOfOneTimeKeys > 1000) return;

	let keyBundle = [];

	for (let i = 0; i < 100; i++) {
		let key = await createKeyPair();
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
