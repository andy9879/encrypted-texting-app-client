<script setup>
import { onMounted, ref, useTemplateRef, defineProps } from "vue";
import Quill from "/node_modules/quill/dist/quill.js";
import Container from "quill/blots/container";
import { parse } from "node-html-parser";
import textIcon from "../icons/textIcon.vue";

const editor = useTemplateRef("editor");

let quill = null;

const props = defineProps({
	send: Function,
});

const showToolBar = ref(false);

function OnSend() {
	let html = editor.value?.innerHTML;
	const root = parse(html);
	let input = root.querySelector(".ql-editor")?.innerHTML;
	quill.deleteText(0, quill.getLength());

	props.send(input);
}

onMounted(() => {
	quill = new Quill("#editor", {
		theme: "snow",
		placeholder: "Enter Message",
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
	<div v-show="showToolBar" id="toolbar">
		<button class="ql-italic"></button>

		<button class="ql-underline"></button>
		<button class="ql-bold"></button>

		<button class="ql-script" value="sub"></button>
		<button class="ql-script" value="super"></button>
		<button class="ql-code-block"></button>
	</div>
	<div class="editorWrapper">
		<!-- TODO fix chat input one word wrapping -->
		<div id="editor" ref="editor"></div>
		<div class="editorControls">
			<div @click="showToolBar = !showToolBar" class="editorIcon">
				<textIcon width="20px" height="32px"></textIcon>
			</div>
			<div class="editorIcon pi pi-paperclip"></div>
			<div class="editorIcon pi pi-image"></div>
			<div @click="OnSend()" class="editorIcon pi pi-send"></div>
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
