<script lang="ts">
	import { BASE_API_URL } from '$lib/api';
	import { credentials } from '../stores/credentials-store';
	import { toast } from 'svelte-sonner';
	import { selectedAgent } from '../stores/agent-store';
	import { getChromeStorage, setChromeStorage } from '$lib/chrome-storage';
	import { messages } from '../stores/messages-store';
	import { avatarAgents } from '../stores/avatarAgents';
	import { onMount } from 'svelte'

	credentials.subscribe(async ({ apiKey, orgId }) => {
		if (!apiKey) {
			toast.warning('Please enter an api key', {
				position: 'bottom-center',
				actionButtonStyle: 'bg-black' 
			})
			return
		}

		const headers: HeadersInit = {
			Authorization: `Bearer ${apiKey}`
		}

		if (orgId) headers['CodeGPT-Org-Id'] = orgId

		const res = await fetch(`${BASE_API_URL}/agents`, {
			headers
		})

		if (!res.ok) {
			toast.error(`Failed to fetch agents`, { position: 'bottom-center' })
			return
		}

		const agentsData = await res.json()

		avatarAgents.set(agentsData)
	})

	onMount(async () => {
		if (typeof chrome !== 'undefined' && chrome.storage) { // mejorar esto, si preguntan, un mago lo hizo.
			const storage = await getChromeStorage(['selectedAgent']);
			const storedAgent = storage ? storage['selectedAgent'] : null;
			if (storedAgent) {
				selectedAgent.set(storedAgent);
			}
		}
	});

	selectedAgent.subscribe(async (agentId) => {
		if (typeof chrome !== 'undefined' && chrome.storage && agentId) {
			await setChromeStorage({ 'selectedAgent': agentId });
		}
	});

</script>

<select class="select" bind:value={$selectedAgent}>
	<option value="" disabled selected>Select an agent</option>
	{#each $avatarAgents as { id, name } (id)}
		<option value={id}>{name}</option>
	{/each}
</select>
