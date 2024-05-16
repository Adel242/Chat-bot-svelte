<script lang="ts">
	import Agents from '../components/agents.svelte'
	import CleanChat from '../components/clean-chat.svelte'
	import Messages from '../components/messages.svelte';
	import { removeChromeStorage, getChromeStorage } from '$lib/chrome-storage'
	import { selectedAgent } from '../stores/agent-store'
	// import { credentials } from '../stores/credentials-store';

	const cleanMessages = async () => {
		let messages = []
		await removeChromeStorage(`${$selectedAgent}-messages`)
	}

</script>
<main class="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full p-2">
	<div id='chat-header' class="w-full flex gap-2 justify-between">
		<Agents />
		<CleanChat on:click={cleanMessages} />
		<!-- {#if messages.length && !loading}
			<CleanChat on:click={cleanMessages} />
		{/if} -->
	</div>
	<!-- <Agents /> -->
	<Messages />
</main>
