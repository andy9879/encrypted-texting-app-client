<script setup>
import { onMounted, ref } from "vue";
import Quill from "/node_modules/quill/dist/quill.js";

onMounted(() => {
	const quill = new Quill("#editor", {
		theme: "snow",
		modules: {
			// Equivalent to { toolbar: { container: '#toolbar' }}
			toolbar: "#toolbar",
		},
	});
});
</script>

<template>
	<div>
		<!-- make sure to densentize text data on the server side -->
		<!-- Create the toolbar container -->
		<div id="toolbar">
			<button class="ql-bold">Bold</button>
			<button class="ql-italic">Italic</button>
		</div>

		<!-- Create the editor container -->
		<div id="editor">
			<p>Hello World!</p>
			<p>Some initial <strong>bold</strong> text</p>
			<p><br /></p>
		</div>
	</div>
</template>

<style>
@import "/node_modules/quill/dist/quill.core.css";
@import "/node_modules/quill/dist/quill.snow.css";
</style>

<style scoped>
@import "./chatInterfaceInput.scss";
</style>
