<script setup>
import { onMounted, ref } from "vue";
import Quill from "/node_modules/quill/dist/quill.js";
import Container from "quill/blots/container";

onMounted(() => {
	const quill = new Quill("#editor", {
		theme: "snow",
		modules: {
			// Equivalent to { toolbar: { container: '#toolbar' }}
			toolbar: {
				container: "#toolbar",
			},
		},
	});
});
</script>

<template>
	<!-- TODO Fix toolBar -->
	<div id="toolbar" style="display: none">
		<!-- Add font size dropdown -->
		<select class="ql-size">
			<option value="small"></option>
			<!-- Note a missing, thus falsy value, is used to reset to default -->
			<option selected></option>
			<option value="large"></option>
			<option value="huge"></option>
		</select>
		<!-- Add a bold button -->
		<button class="ql-bold"></button>
		<!-- Add subscript and superscript buttons -->
		<button class="ql-script" value="sub"></button>
		<button class="ql-script" value="super"></button>
	</div>
	<div class="editorWrapper">
		<!--TODO make sure to densentize text data on the server side -->
		<!-- TODO fix chat input one word wrapping -->
		<div id="editor">
			<p>Hello World!</p>
		</div>
		<div>
			<div class="editorIcon pi pi-paperclip"></div>
			<div class="editorIcon pi pi-image"></div>
			<div class="editorIcon pi pi-send"></div>
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
