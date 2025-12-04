<script setup>
import { defineProps } from "vue";

const props = defineProps({
	width: String,
	height: String,
});
</script>

<template>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 -960 960 960"
		:width="props.width"
		:height="props.height"
		fill="currentColor"
	>
		<path
			d="M280-160v-520H80v-120h520v120H400v520H280Zm360 0v-320H520v-120h360v120H760v320H640Z"
		/>
	</svg>
</template>

<style lang="scss" scoped></style>
