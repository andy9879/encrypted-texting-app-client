<script setup>
import { ref } from "vue";
// const fs = window.electron.fs;

import { useServerDataStore } from "@/stores/serverData";

let serverData = useServerDataStore();

import { useClientDataStore } from "@/stores/clientData";

let clientData = useClientDataStore();

import { socket, socketInit, socketGlobalListeners } from "@/scripts/socket";

import { createKeyPair } from "@/scripts/manageKeys";

import router from "@/router";
import sha256 from "js-sha256";

async function connectToServer(url, port) {
	loadingWheel.value = true;
	console.log(url);
	console.log(port);

	//TODO Add error handling

	function connected() {
		return new Promise((resolve) => {
			socketInit(url, port);

			socket.on("connect", resolve);

			socketGlobalListeners();
		});
	}

	await connected();

	console.log("Connected to Server");

	return socket;
}

const loginForm = ref(true);
const loginFormData = ref({
	username: "",
	password: "",
	repeatPassword: "",
	address: "localhost",
	port: 443,
	rememberMe: false,
});
const loadingWheel = ref(false);
const displayUserCreated = ref(false);
const formError = ref("");
const userCreatedMsg = ref(false);

//TODO Check if server is online

async function createAccount() {
	if (loginFormData.value.username == "") {
		formError.value = "Username can not be blank";
		return;
	}

	if (loginFormData.value.password == "") {
		formError.value = "Password can not be blank";
		return;
	}

	if (
		new String(loginFormData.value.password).valueOf() !=
		new String(loginFormData.value.repeatPassword).valueOf()
	) {
		formError.value = "Passwords do not match";
		return;
	}

	//TODO put socket in store

	let socket = await connectToServer(
		"https://" + loginFormData.value.address,
		loginFormData.value.port
	);

	let iK = await createKeyPair();

	clientData.data.iK = iK;

	socket.emit(
		"newAccount",
		JSON.stringify({
			...loginFormData.value,
			iK: iK.pub,
		})
	);

	socket.on("usernameExists", () => {
		loadingWheel.value = false;
		formError.value = "Username already exists";
		socket.disconnect();
	});

	socket.on("userCreated", async () => {
		//TODO Make a loading wheel or something tell data is done writing
		loadingWheel.value = false;
		loginForm.value = true;
		formError.value = "";
		userCreatedMsg.value = true;

		await clientData.changeUsername(loginFormData.value.username);

		clientData.passwdHash = sha256(loginFormData.value.password);

		clientData.writeData();

		socket.disconnect();
	});
}

async function login() {
	loadingWheel.value = true;
	let socket = await connectToServer(
		"https://" + loginFormData.value.address,
		loginFormData.value.port
	);

	socket.emit("login", loginFormData.value);

	socket.on("WrongUsernameOrPassword", () => {
		socket.disconnect();
		formError.value = "Wrong username or password";
		loadingWheel.value = false;
	});

	socket.on("sucsefullyLogedIn", async (userData) => {
		//TODO make better hash
		await clientData.changeUsername(loginFormData.value.username);
		clientData.passwdHash = sha256(loginFormData.value.password);
		await clientData.loadData();
		serverData.profilePicture = userData.profilePicture;
		serverData.friendRequests.incoming = userData.friendRequests.incoming;
		serverData.friendRequests.outgoing = userData.friendRequests.outgoing;
		for (let type in serverData.friendRequests) {
			for (let request of serverData.friendRequests[type]) {
				request.profilePicture = await serverData.otherUserProfilePicture(
					request.username
				);
			}
		}
		serverData.incomingMessages = userData.incomingMessages;

		console.log("Logged In");

		router.push("/chat/servers");
	});
}

function switchForms() {
	loginForm.value = !loginForm.value;
}

// $("#toast").toast();
</script>

<template>
	<header>
		<div class="row justify-content-center">
			<div class="col-5" style="display: flex; justify-content: center">
				<b-button @click="switchForms()" type="submit"> Login / Sign Up </b-button>
			</div>
		</div>
	</header>

	<div class="loginForm">
		<div v-show="userCreatedMsg" class="row">
			<div class="col-12 userCreated centerText">Sucssesfuly Created User</div>
		</div>

		<div class="row">
			<div class="col-8">
				<label class="form-label">Server Address</label>
				<b-input class="textInput" v-model="loginFormData.address" type="text" />
			</div>

			<div class="col-4">
				<label class="form-label">Port</label>
				<b-input class="textInput" v-model="loginFormData.port" type="number" />
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<label>Username</label>
				<b-input class="textInput" v-model="loginFormData.username" type="text" />
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<label>Password</label>
				<b-input
					class="textInput"
					v-model="loginFormData.password"
					type="password"
				/>
			</div>
		</div>
		<div v-show="!loginForm" class="row">
			<div class="col-12">
				<label>Repeat Password</label>
				<b-input
					class="textInput"
					v-model="loginFormData.repeatPassword"
					type="password"
				/>
			</div>
		</div>

		<div v-show="formError.length > 0" class="row">
			<div class="col-12 formError centerText">
				{{ formError }}
			</div>
		</div>

		<div class="row align-items-center">
			<div class="col-2">
				<b-button @click="login()" v-show="loginForm && !loadingWheel">
					Login
				</b-button>
				<b-button @click="createAccount()" v-show="!loginForm && !loadingWheel">
					Sign Up
				</b-button>

				<div
					v-show="loadingWheel"
					class="spinner-border text-primary"
					role="status"
				>
					<span class="sr-only"></span>
				</div>
			</div>
			<div class="col-3">
				<label style="margin-right: 10px; display: inline" class="form-check-label"
					>Remember me</label
				>
				<b-checkbox style="display: inline" v-model="loginFormData.rememberMe" />
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./login.scss";
</style>
