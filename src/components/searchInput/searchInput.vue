<script setup>
import { ref, defineProps, defineModel } from "vue";
const model = defineModel(); // default modelValue

const props = defineProps({
	search: Function,
	showCancel: Boolean,
	cancel: Function,
});

function search() {
	props.search(model.value);
}
</script>

<template>
	<div class="wrapper">
		<div class="search-controls">
			<div @click="search()" class="pi pi-search control"></div>
			<div
				v-show="props.showCancel"
				@click="props.cancel()"
				style="margin-top: 5px"
				class="pi pi-times-circle control"
			></div>
		</div>
		<span>
			<input v-model="model" placeholder="Search Users" />
		</span>
	</div>
</template>

<style scoped>
@import "./searchInput.scss";
</style>
