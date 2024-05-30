<script lang="ts">
	import Agents from '../components/agents.svelte'
	import CleanChat from '../components/clean-chat.svelte'
	import Messages from '../components/messages.svelte'
	import { clearMessages } from '../stores/clearChat'

	function handleClearMessages() {
		clearMessages.set(true)
	}
</script>

<main class="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full p-2">
	<div id="chat-header" class="w-full flex gap-2 justify-between items-center">
		<Agents />
		<CleanChat on:click={handleClearMessages} />
	</div>
	<Messages />
</main>
