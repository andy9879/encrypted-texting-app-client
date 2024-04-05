<script setup>
import { ref } from "vue";

// const fs = window.electron.fs;

// // console.log(fs.readFileSync("./index.js", { encoding: "utf8" }));

// import io from "socket.io-client";

// // Connect to the Socket.IO server with the self-signed certificate
// const socket = io("https://localhost", {});

// // Event handler for disconnection
// socket.on("disconnect", () => {
// 	console.log("Disconnected from server");
// });

// // Function to handle incoming messages from the server
// socket.on("chat message", function (msg) {
// 	console.log("Received message:", msg);
// });

// // Function to send messages to the server
// function sendMessage(message) {
// 	socket.emit("chat message", message);
// }

const loginForm = ref(true);

const loginFormData = ref({
	username: "",
	password: "",
	repeatPassword: "",
	address: "",
	port: 443,
	rememberMe: false,
});

const formError = ref("");
function switchForms() {
	loginForm.value = !loginForm.value;
}

// Example usage: sending a message to the server
// sendMessage("Hello, server!");
</script>

<template>
	<header>
		<div class="row justify-content-center">
			<div class="col-5" style="display: flex; justify-content: center">
				<button @click="switchForms()" type="submit" class="btn btn-primary">
					Login / Sign Up
				</button>
			</div>
		</div>
	</header>

	<div class="container">
		<div class="row justify-content-center">
			<div class="col-6">
				<label class="form-label">Server Address</label>
				<input v-model="loginFormData.address" type="text" class="form-control" />
			</div>

			<div class="col-2">
				<label class="form-label">Port</label>
				<input v-model="loginFormData.port" type="number" class="form-control" />
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-8">
				<label>Username</label>
				<input v-model="loginFormData.username" type="text" class="form-control" />
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-8">
				<label>Password</label>
				<input
					v-model="loginFormData.password"
					type="password"
					class="form-control"
				/>
			</div>
		</div>
		<div v-show="!loginForm" class="row justify-content-center">
			<div class="col-8">
				<label>Repeat Password</label>
				<input
					v-model="loginFormData.repeatPassword"
					type="password"
					class="form-control"
				/>
			</div>
		</div>

		<div v-show="formError.length > 0" class="row justify-content-center">
			<div class="col-4 formError">
				{{ formError }}
			</div>
		</div>

		<div class="row align-items-center justify-content-center">
			<div class="col-2">
				<button v-show="loginForm" class="btn btn-primary">Login</button>
				<button v-show="!loginForm" class="btn btn-primary">Sign Up</button>
			</div>
			<div class="col-4">
				<label style="margin-right: 10px" class="form-check-label"
					>Remember me</label
				>
				<input
					v-model="loginFormData.rememberMe"
					type="checkbox"
					class="form-check-input"
					id="exampleCheck1"
				/>
			</div>
			<div class="col-2"></div>
		</div>
	</div>
</template>

<style scoped>
@import "./login.scss";
</style>
