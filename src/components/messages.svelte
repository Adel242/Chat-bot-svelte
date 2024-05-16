<script lang="ts" src="https://cdn.tailwindcss.com ">
	import { streamReader } from '../lib/stream-reader'
	import type { Message } from '../types'
	import Loader from './loader.svelte'
	import { BASE_API_URL } from '$lib/api'
	import { credentials } from '../stores/credentials-store'
	import { getChromeStorage, removeChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { selectedAgent } from '../stores/agent-store'
	import { toast } from 'svelte-sonner'
	import Markdown from './markdown.svelte'
	import { avatarAgents } from '../stores/avatarAgents'
	import { user } from '../stores/users-store'

	let chatMessages: HTMLDivElement
	let messages: Message[] = []
	let loading = false
	let renderingMessage = false
	let inputValue = ''
	$: currentAgent = $avatarAgents.find((agent) => agent.id === $selectedAgent)
	let stopGenerating = false
	let abortController

	const scrollToBottom = () => {
		chatMessages.scrollTop = chatMessages.scrollHeight
	}

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

	const handleSubmit = async (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		e.preventDefault()
		const input = inputValue.trim()
		if (!input) return
		if (!$selectedAgent) {
			toast.warning('Please select an agent')
			return
		}
		if (input.length < 3 || loading || renderingMessage) {
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
		renderingMessage = true
		stopGenerating = false
		chatMessages.scrollTop = chatMessages.scrollHeight
		abortController = new AbortController()

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
			renderingMessage = false
			return
		}

		for await (const chunk of streamReader(res)) {
			if (stopGenerating) {
				break
			}
			if (messages[messages.length - 1].role !== 'assistant') {
				messages = [...messages, { role: 'assistant', content: '', createdAt: Date.now() }]
				loading = false
				chatMessages.scrollTop = chatMessages.scrollHeight
			}
			messages[messages.length - 1].content += chunk
		}

		scrollToBottom();

		renderingMessage = false
		await setChromeStorage({ [`${$selectedAgent}-messages`]: messages })
	}

	function handleKeyPress(e: any) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			document.getElementById('sendButton')?.click()
		}
	}

	const stopGeneration = () => {
		stopGenerating = true
	}

</script>

<div
	id="chat-messages"
	bind:this={chatMessages}
	class="chat-messages p-3 overflow-y-auto text-sm flex flex-col gap-4 max-h-[26rem]"
>
	{#each messages as { content, role }}
		<section class="grid gap-4">
			{#if role === 'assistant' && selectedAgent}
				<div class="flex items-center gap-2">
					<img src={currentAgent?.image} alt="Agent" class="w-6 h-6 rounded-full" />
					<div>{currentAgent?.name}</div>
				</div>
			{/if}
			{#if role === 'user'}
				<div class="flex items-center gap-2">
					<img src={$user?.avatar_url} alt={$user?.full_name} class="w-6 h-6 rounded-full" />
					<div>{$user?.full_name}</div>
				</div>
			{/if}
			<Markdown {content} />
		</section>
	{/each}
	{#if loading}
		<button class="btn btn-loading btn-outline btn-sm border w-fit">Thinking</button>
	{/if}
</div>

<footer>
	<form on:submit|preventDefault={handleSubmit} class="w-full flex gap-2">
		<textarea
			name="input"
			class="textarea resize-none text-sm textarea-block"
			cols="100"
			rows="1"
			placeholder="Type your message..."
			bind:value={inputValue}
			on:keypress={handleKeyPress}
		/>
		<div class="flex flex-grow justify-between items-center gap-2">
			<div>
				{#if renderingMessage && !loading}
					<button
						type="button"
						class="btn btn-error btn-sm"
						on:click={stopGeneration}
					>
						Stop
					</button>
				{:else}
					<button
						id='sendButton'
						type="submit"
						class="btn btn-primary"
						disabled={loading || inputValue.trim().length < 1}
						style="cursor: pointer;"
					>
						Send
					</button>
				{/if}
			</div>
		</div>
	</form>
</footer>
