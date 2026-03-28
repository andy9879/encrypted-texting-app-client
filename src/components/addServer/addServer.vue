<script setup>
import { ref, defineEmits } from 'vue'
import { createServer as createServerReq } from '@/scripts/serverApi.js'

let serverName = ref('')

const emit = defineEmits(['close'])

async function createServer () {
	let res = await createServerReq(serverName.value)
	emit('close')
}
</script>

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
				<b-button @click="createServer()" style="margin-right: 10px">
					Create
				</b-button>

				<b-input
					v-model="serverName"
					class="textInput"
					placeholder="Server Name"
					type="text"
				></b-input>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import './addServer.scss';
</style>
