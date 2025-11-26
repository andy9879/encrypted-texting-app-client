let serverUrl = null;
let serverPort = null;

export { serverUrl as url };
export { serverPort as port };

export async function getUserProfilePic(username) {
	return await fetch(
		`https://${serverUrl}:${port}/profilePicture/${username}/`,
	).text();
}

export async function createAccount() {
	return await fetch(`https://${serverUrl}:${serverPort}/createAccount`, {
		method: "POST",
	});
}
