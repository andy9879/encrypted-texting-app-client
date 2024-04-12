export let userData = null;

export let passwdHash = null;

export function setPasswordHash(hash) {
	passwdHash = hash;
}

export async function getUserData() {
	userData = await window.manageFiles.getUserData(hash);
}

export async function writeUserData(data, hash) {
	await window.manageFiles.writeUserData(data, hash);
}
