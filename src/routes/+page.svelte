<script>
	import Agents from '../components/agents.svelte'
	import Messages from '../components/messages.svelte'
	import { credentials } from '../stores/credentials-store'
</script>

<main class="grid grid-rows-[auto_1fr_auto] grid-cols-1 h-full p-2 gap-2 bg-zinc-800">
	<Agents />
	<Messages />
</main>
