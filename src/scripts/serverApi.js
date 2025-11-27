let serverUrl = null;
let serverPort = null;

export { serverUrl as url };
export { serverPort as port };

import { useServerDataStore } from "@/stores/serverData";

export async function refreshToken() {
	let serverData = useServerDataStore();

	return await (
		await fetch(`https://${serverUrl}:${serverPort}/account/refreshJwt`, {
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${serverData.jwt}`,
			},
			body: JSON.stringify({
				refreshToken: serverData.refreshToken,
			}),
			method: "POST",
		})
	).json();
}

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

export async function addKeyBundle(bundle) {
	let serverData = useServerDataStore();
	return await fetch(`https://${serverUrl}:${serverPort}/account/addKeyBundle`, {
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${serverData.jwt}`,
		},
		body: JSON.stringify({ bundle }),
		method: "POST",
	});
}
