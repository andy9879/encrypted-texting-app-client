<script setup>
const fs = window.electron.fs;

// console.log(fs.readFileSync("./index.js", { encoding: "utf8" }));

import io from "socket.io-client";

// Connect to the Socket.IO server with the self-signed certificate
const socket = io("https://localhost", {});

// Event handler for disconnection
socket.on("disconnect", () => {
	console.log("Disconnected from server");
});

// Function to handle incoming messages from the server
socket.on("chat message", function (msg) {
	console.log("Received message:", msg);
});

// Function to send messages to the server
function sendMessage(message) {
	socket.emit("chat message", message);
}

// Example usage: sending a message to the server
sendMessage("Hello, server!");
</script>

<template>
	<header>
		<div class="row justify-content-center">
			<div class="col-2 justify-content-center">
				<h2>Login</h2>
			</div>
		</div>
	</header>

	<div class="container">
		<div class="row justify-content-center">
			<div class="col-6">
				<label class="form-label">Server Address</label>
				<input type="text" class="form-control" />
			</div>

			<div class="col-2">
				<label class="form-label">Port</label>
				<input type="text" class="form-control" />
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-8">
				<label>Username</label>
				<input type="text" class="form-control" />
			</div>
		</div>

		<div class="row justify-content-center">
			<div class="col-8">
				<label>Password</label>
				<input type="password" class="form-control" />
			</div>
		</div>
		<div class="row justify-content-center">
			<div class="col-8">
				<label>Repeat Password</label>
				<input type="password" class="form-control" />
			</div>
		</div>

		<div class="row align-items-center justify-content-center">
			<div class="col-2">
				<button type="submit" class="btn btn-primary">Login</button>
			</div>
			<div class="col-4">
				<label
					style="margin-right: 10px"
					class="form-check-label"
					for="exampleCheck1"
					>Remember me</label
				>
				<input type="checkbox" class="form-check-input" id="exampleCheck1" />
			</div>
			<div class="col-2"></div>
		</div>
	</div>
</template>

<style scoped>
@import "./login.scss";
</style>
