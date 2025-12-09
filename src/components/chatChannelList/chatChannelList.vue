<script setup>
let channelGroups = [
	{
		name: "General",
		id: "1234",
		folded: false,
		channels: [
			{
				name: "chat - 1",
				id: "12345",
				chatNodes: null,
			},
			{
				name: "chat - 2",
				id: "123456",
				chatNodes: null,
			},
		],
	},
];
</script>

<template>
	<div>
		<div v-for="channelGroup in channelGroups" :key="channelGroup.id">
			<div class="row" style="width: 100%">
				<div class="col-2 channelGroupControl">
					<i class="pi pi-chevron-down" style="font-size: 1.25rem"></i>
				</div>
				<div class="col-10" style="padding-left: 5px">
					{{ channelGroup.name }}
				</div>
			</div>
			<div v-for="channel in channelGroup.channels" :key="channel.id">
				<div class="row">
					<div class="col-1"></div>
					<div class="col-9">
						{{ channel.name }}
					</div>
					<div class="col-2"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@import "./chatChannelList.scss";
</style>
