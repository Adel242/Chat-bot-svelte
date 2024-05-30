<script lang="ts">
	import { BASE_API_URL } from '$lib/api'
	import { credentials } from '../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { selectedAgent } from '../stores/agent-store'
	import { getChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { avatarAgents } from '../stores/avatarAgents'
	import { loading } from '../stores/loading-store'

	credentials.subscribe(async ({ apiKey, orgId }) => {
		if (!apiKey) {
			selectedAgent.set(null)
			// toast.warning('Please enter an api key', {
			// 	position: 'bottom-center',
			// 	actionButtonStyle: 'bg-black'
			// })
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

		const storage = await getChromeStorage(['lastSelectedAgent'])
		const lastSelectedAgent = storage ? storage['lastSelectedAgent'] : null

		const defaultAgent = agentsData.length > 0 ? agentsData[0].id : null
		selectedAgent.set(lastSelectedAgent || defaultAgent)
	})

	selectedAgent.subscribe(async (agentId) => {
		if (agentId) {
			await setChromeStorage({ lastSelectedAgent: agentId })
		}
	})
</script>

<select class="select" bind:value={$selectedAgent} disabled={$loading}>
	{#each $avatarAgents as { id, name } (id)}
		<option value={id}>{name}</option>
	{/each}
</select>
