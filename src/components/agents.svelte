<script lang="ts">
	import { BASE_API_URL } from '$lib/api'
	import { onMount } from 'svelte'
	import { credentials } from '../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import type { Agent } from '../types'
	import { selectedAgent } from '../stores/agent-store'
	import { getChromeStorage } from '$lib/chrome-storage'
	import { messages } from '../stores/messages-store'

	let agents: Agent[] = []

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (!storage) return
		const apiKey = $credentials.apiKey || storage['apiKey']
		const orgId = $credentials.orgId || storage['orgId']
		if (!apiKey) return

		const headers: HeadersInit = {
			Authorization: `Bearer ${apiKey}`
		}

		if (orgId) headers['CodeGPT-Org-Id'] = orgId

		const res = await fetch(`${BASE_API_URL}/agents`, {
			headers
		})

		if (!res.ok) {
			toast.error(`Failed to fetch agents`)
			return
		}

		agents = await res.json()
	})

	const handleChange = async () => {
		const storage = await getChromeStorage([`${$selectedAgent}-messages`])
		if (!storage) return
		const storageMessages = storage['messages'] === 'null' ? [] : storage['messages']

		messages.set(storageMessages)
	}
</script>

<select class="select max-w-full" bind:value={$selectedAgent} on:change={handleChange}>
	<option value="" disabled selected>Select an agent</option>
	{#each agents as { id, name } (id)}
		<option value={id}>{name}</option>
	{/each}
</select>
