<script setup>
import { ref } from "vue";

// const fs = window.electron.fs;

import io, { connect } from "socket.io-client";

async function connectToServer(url, port) {
	loadingWheel.value = true;
	console.log(url);
	console.log(port);

	//TODO Add error handling

	let socket = null;

	function connected() {
		return new Promise((resolve) => {
			socket = io(url + ":" + port);
			socket.on("connect", resolve);
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
	address: "",
	port: 443,
	rememberMe: false,
});

const loadingWheel = ref(false);

const displayUserCreated = ref(false);

const formError = ref("");

const userCreatedMsg = ref(false);

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

	socket.emit("newAccount", JSON.stringify(loginFormData.value));

	socket.on("usernameExists", () => {
		loadingWheel.value = false;
		formError.value = "Username already exists";
		socket.disconnect();
	});

	socket.on("userCreated", () => {
		loadingWheel.value = false;
		loginForm.value = true;
		formError.value = "";
		userCreatedMsg.value = true;
		socket.disconnect();
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
				<b-input v-model="loginFormData.address" type="text" />
			</div>

			<div class="col-4">
				<label class="form-label">Port</label>
				<b-input v-model="loginFormData.port" type="number" />
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<label>Username</label>
				<b-input v-model="loginFormData.username" type="text" />
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<label>Password</label>
				<b-input v-model="loginFormData.password" type="password" />
			</div>
		</div>
		<div v-show="!loginForm" class="row">
			<div class="col-12">
				<label>Repeat Password</label>
				<b-input v-model="loginFormData.repeatPassword" type="password" />
			</div>
		</div>

		<div v-show="formError.length > 0" class="row">
			<div class="col-12 formError centerText">
				{{ formError }}
			</div>
		</div>

		<div class="row align-items-center">
			<div class="col-2">
				<b-button v-show="loginForm && !loadingWheel"> Login </b-button>
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
