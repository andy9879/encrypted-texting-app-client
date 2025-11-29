let serverUrl = null;
let serverPort = null;

export { serverUrl as url };
export { serverPort as port };

import { useServerDataStore } from "@/stores/serverData";

function createUrl() {
	return `https://${serverUrl}:${serverPort}`;
}

function authHeader() {
	let serverData = useServerDataStore();
	return { authorization: `Bearer ${serverData.jwt}` };
}

export async function refreshToken() {
	let serverData = useServerDataStore();

	return await (
		await fetch(`${createUrl()}/account/refreshJwt`, {
			headers: {
				"Content-Type": "application/json",
				...authHeader(),
			},
			body: JSON.stringify({
				refreshToken: serverData.refreshToken,
			}),
			method: "POST",
		})
	).json();
}

export async function getUserProfilePic(username) {
	let res = await fetch(`${createUrl()}/users/profilePicture/${username}/`);
	return res.body;
}

export async function createAccount(data) {
	return await fetch(`${createUrl()}/account/createAccount`, {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		method: "POST",
	});
}

export async function login(data) {
	return await fetch(`${createUrl()}/account/login`, {
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		method: "POST",
	});
}

export async function addKeyBundle(bundle) {
	return await fetch(`${createUrl()}/account/addKeyBundle`, {
		headers: {
			"Content-Type": "application/json",
			...authHeader(),
		},
		body: JSON.stringify({ bundle }),
		method: "POST",
	});
}

export async function requestPreKeyBundle(userId) {
	return await (
		await fetch(`${createUrl()}/users/requestPreKeyBundle/${userId}`, {
			headers: {
				...authHeader(),
			},
			method: "GET",
		})
	).json();
}

export async function findUser(username) {
	return await (
		await fetch(`${createUrl()}/users/findUser/${username}`, {
			headers: {
				...authHeader(),
			},
			method: "GET",
		})
	).json();
}
