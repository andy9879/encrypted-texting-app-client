<script setup>
import { ref } from "vue";

const count = ref(0);
</script>

<template>
	<div class="content">
		<div class="row">
			<div class="col-8">
				<b-input class="textInput"></b-input>
			</div>
			<div class="col-2">
				<b-button>Search</b-button>
			</div>
		</div>
		<div class="row result">
			<div class="col-1">
				<img class="resultIcon" src="@/assets/testIcon2.jpg" />
			</div>
			<div class="col-7 resultText" style="diplay">Username or something</div>
			<div class="col-2">
				<b-button>Add</b-button>
			</div>
		</div>
	</div>
</template>

<style scoped>
@import "./addFriend.scss";
</style>
