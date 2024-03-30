<script lang="ts">
	import { marked } from 'marked'
	import CleanChat from './clean-chat.svelte'
	import { streamReader } from '../lib/stream-reader'
	import type { Message } from '../types'
	import Loader from './loader.svelte'
	import { BASE_API_URL } from '$lib/api'
	import { credentials } from '../stores/credentials-store'
	import { getChromeStorage, removeChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { selectedAgent } from '../stores/agent-store'
	import { toast } from 'svelte-sonner'

	let chatMessages: HTMLDivElement
	let messages: Message[] = []
	let loading = false

	selectedAgent.subscribe(async () => {
		if (!$selectedAgent) return
		const storage = await getChromeStorage([`${$selectedAgent}-messages`])
		if (!storage) {
			messages = []
			return
		}
		const storedMessages = storage[`${$selectedAgent}-messages`] ?? []

		messages = storedMessages
	})

	const renderer = new marked.Renderer()

	renderer.link = function (href, title, text) {
		const titleProp = title ? ` title="${title}"` : ''
		return `<a target="_blank" class="underline" href="${href}"${titleProp}>${text}</a>`
	}

	const cleanMessages = async () => {
		const confirmation = confirm('Are you sure you want to delete all chat messages?')
		if (!confirmation) return
		messages = []
		await removeChromeStorage(`${$selectedAgent}-messages`)
	}

	const handleSubmit = async (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		const formData = new FormData(e.currentTarget)
		const input = formData.get('input') as string

		if (!input) return

		if (!$selectedAgent) {
			toast.warning('Please select an agent')
			return
		}

		e.currentTarget.reset()

		messages = [
			...messages,
			{
				role: 'user',
				content: input,
				createdAt: Date.now()
			}
		]

		loading = true
		chatMessages.scrollTop = chatMessages.scrollHeight

		const headers: HeadersInit = {
			Authorization: `Bearer ${$credentials.apiKey}`,
			'Content-Type': 'application/json'
		}

		if ($credentials.orgId) headers['CodeGPT-Org-Id'] = $credentials.orgId

		const res = await fetch(`${BASE_API_URL}/chat/completions`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				stream: true,
				format: 'json',
				messages,
				agentId: $selectedAgent
			})
		})

		if (!res.ok) {
			console.error('Failed to send message')
			messages = [
				...messages,
				{ role: 'assistant', content: 'Failed to send message', createdAt: Date.now() }
			]
			loading = false
			return
		}

		for await (const chunk of streamReader(res)) {
			if (messages[messages.length - 1].role !== 'assistant') {
				messages = [...messages, { role: 'assistant', content: '', createdAt: Date.now() }]
				loading = false
				chatMessages.scrollTop = chatMessages.scrollHeight
			}
			messages[messages.length - 1].content += chunk
		}

		await setChromeStorage({ [`${$selectedAgent}-messages`]: messages })
	}
</script>

<div
	id="chat-messages"
	bind:this={chatMessages}
	class="chat-messages flex-1 p-4 overflow-y-auto max-h-[21rem]"
>
	{#each messages as { content, role }}
		<div class="flex mb-3 {role === 'user' ? 'justify-end' : 'justify-start'}">
			<div
				class="
        a
        rounded-lg py-2 px-4 max-w-[70%]
        grid
        gap-2
        {role === 'user' ? 'bg-slate-900 text-white' : 'bg-gray-200 text-black'}
        "
			>
				{@html marked.parse(content, { renderer })}
			</div>
		</div>
	{/each}
	{#if loading}
		<Loader />
	{/if}
</div>
{#if messages.length}
	<CleanChat on:click={cleanMessages} />
{/if}
<div class="border-gray-200 pt-4 border-t">
	<form on:submit|preventDefault={handleSubmit} class="flex space-x-4 items-center">
		<input
			type="text"
			name="input"
			class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4"
			placeholder="Type your message..."
		/>
		<button class="bg-slate-900 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
	</form>
</div>
