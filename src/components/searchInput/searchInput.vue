<script setup>
import { ref, defineProps, defineModel } from "vue";
const model = defineModel(); // default modelValue

const props = defineProps({
	search: Function,
});

function search() {
	props.search(model.value);
}
</script>

<template>
	<span @click="search()" class="pi pi-search"></span>
	<span>
		<input v-model="model" />
	</span>
</template>

<style scoped>
@import "./searchInput.scss";
</style>
