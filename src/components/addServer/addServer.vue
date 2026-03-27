<script setup></script>

<template>
	<div class="row">
		<div class="col-6">
			<h3>Join Server</h3>
			<div style="display: flex">
				<b-button style="margin-right: 10px">Join</b-button>

				<b-input class="textInput" placeholder="Invite Code"></b-input>
			</div>
		</div>
		<div class="col-6">
			<h3>Create Server</h3>
			<div style="display: flex">
				<b-button style="margin-right: 10px"> Create </b-button>

				<b-input class="textInput" placeholder="Server Name" type="text"></b-input>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './addServer.scss';
</style>
