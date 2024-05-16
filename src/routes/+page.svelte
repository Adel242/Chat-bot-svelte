<script>
	import Agents from '../components/agents.svelte'
	import Messages from '../components/messages.svelte';
	// import { credentials } from '../stores/credentials-store';
</script>
<main class="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full p-2">
	<div id='chat-header' class="w-full max-w-40">
		<Agents />
	</div>
	<!-- <Agents /> -->
	<Messages />
</main>
