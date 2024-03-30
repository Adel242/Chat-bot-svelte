<script>
	import Agents from '../components/agents.svelte'
	import Messages from '../components/messages.svelte'
	import { credentials } from '../stores/credentials-store'
</script>

<main class="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full p-4 gap-2">
	<Agents />

	<Messages />
</main>
