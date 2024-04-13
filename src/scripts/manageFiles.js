export let userData = null;

export let passwdHash = null;

export function setPasswordHash(hash) {
	debugger;
	passwdHash = hash;
}

export async function getUserData(hash) {
	console.log(hash);
	userData = await window.manageFiles.getUserData(hash);
}

export async function writeUserData(data, hash) {
	await window.manageFiles.writeUserData(data, hash);
}
