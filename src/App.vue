<script setup>
import { RouterLink, RouterView } from "vue-router";
import { refreshTokenTimer } from "@/scripts/refreshToken";

refreshTokenTimer();
</script>

<template>
	<RouterView />
</template>

<style>
@import "@/assets/main.scss";
</style>
