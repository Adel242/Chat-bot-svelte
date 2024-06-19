<script lang="ts">
	import { credentials } from '../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { selectedAgent } from '../stores/agent-store'
	import { getChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { loading } from '../stores/loading-store'
	import type { Agent } from '@/types'
	import { onMount } from 'svelte'
	import { getAgents } from '@/services/agents'

	let agents: Agent[] = []
	$: agentId = $selectedAgent?.id

	credentials.subscribe(async ({ apiKey, orgId }) => {
		if (!apiKey) {
			selectedAgent.set(null)
			// toast.warning('Please enter an api key', {
			// 	position: 'bottom-center',
			// 	actionButtonStyle: 'bg-black'
			// })
			return
		}

		const data = await getAgents({ apiKey, orgId })

		if (data.length === 0) {
			toast.warning('No agents found', { position: 'top-center' })
			return
		}

		agents = data

		const storage = await getChromeStorage(['lastSelectedAgent'])
		const lastSelectedAgent = storage ? storage['lastSelectedAgent'] : null

		const defaultAgent =
			data.length > 0
				? {
						id: data[0].id,
						image: data[0].image,
						name: data[0].name
					}
				: null

		selectedAgent.set(lastSelectedAgent ?? defaultAgent)
	})

	selectedAgent.subscribe(async (selectedAgent) => {
		if (selectedAgent) {
			await setChromeStorage({
				lastSelectedAgent: {
					id: selectedAgent.id,
					image: selectedAgent.image,
					name: selectedAgent.name
				}
			})
		}
	})

	const handleAgentChange = (
		e: Event & {
			currentTarget: EventTarget & HTMLSelectElement
		}
	) => {
		const agentId = (e.currentTarget as HTMLSelectElement).value

		const agent = agents.find((agent) => agent.id === agentId)
		if (!agent) return

		selectedAgent.set({
			id: agent.id,
			image: agent.image,
			name: agent.name
		})
	}

	onMount(async () => {
		if (!$credentials.apiKey) {
			selectedAgent.set(null)
			// toast.warning('Please enter an api key', {
			// 	position: 'bottom-center',
			// 	actionButtonStyle: 'bg-black'
			// })
			return
		}

		const data = await getAgents({ apiKey: $credentials.apiKey, orgId: $credentials.orgId })
		agents = data

		const storage = await getChromeStorage(['lastSelectedAgent'])
		const lastSelectedAgent = storage ? storage['lastSelectedAgent'] : null

		const defaultAgent =
			data.length > 0
				? {
						id: data[0].id,
						image: data[0].image,
						name: data[0].name
					}
				: null

		selectedAgent.set(lastSelectedAgent ?? defaultAgent)
	})
</script>

<select
	placeholder="My AI Agents"
	class="select"
	value={agentId}
	disabled={$loading}
	on:change={handleAgentChange}
>
	<option disabled>My AI Agents</option>
	{#each agents as { id, name } (id)}
		<option value={id}>{name}</option>
	{/each}
</select>
