let serverUrl = null;
let serverPort = null;

export { serverUrl as url };
export { serverPort as port };

export async function getUserProfilePic(username) {
	return await fetch(
		`https://${serverUrl}:${port}/profilePicture/${username}/`,
	).text();
}

export async function createAccount(data) {
	console.log(`https://${serverUrl}:${serverPort}/account/createAccount`);
	return await fetch(
		`https://${serverUrl}:${serverPort}/account/createAccount`,
		{
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			method: "POST",
		},
	);
}

export async function login(data) {
	return await fetch(`https://${serverUrl}:${serverPort}/account/login`, {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		method: "POST",
	});
}
