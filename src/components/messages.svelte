<script lang="ts">
	import { streamReader } from '../lib/stream-reader'
	import { BASE_API_URL } from '$lib/api'
	import { credentials } from '../stores/credentials-store'
	import { getChromeStorage, removeChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { selectedAgent } from '../stores/agent-store'
	import { toast } from 'svelte-sonner'
	import Markdown from './markdown.svelte'
	import { user } from '../stores/users-store'
	import { clearMessages } from '../stores/clearChat'
	import { loading } from '../stores/loading-store'
	import { messages } from '../stores/messages-store'
	import { isModelStreaming } from '../stores/is-model-streaming-store'
	import Sparkles from './icons/sparkles.svelte'

	let chatMessages: HTMLDivElement
	let renderingMessage = false
	let inputValue = ''
	let stopGenerating = false
	let abortController
	// let lastCleared = Date.now()

	clearMessages.subscribe((value) => {
		if (value) {
			cleanMessages()
			clearMessages.set(false)
		}
	})

	const cleanMessages = async () => {
		await removeChromeStorage(`${$selectedAgent?.id}-messages`)
		$messages = []
		// lastCleared = Date.now()
	}

	const scrollToBottom = () => {
		chatMessages.scrollTop = chatMessages.scrollHeight
	}

	selectedAgent.subscribe(async () => {
		if (!$selectedAgent) return
		const storage = await getChromeStorage([`${$selectedAgent.id}-messages`])
		if (!storage) {
			$messages = []
			return
		}
		const storedMessages = storage[`${$selectedAgent.id}-messages`] ?? []

		$messages = storedMessages
	})

	const handleSubmit = async (e: SubmitEvent & { currentTarget: HTMLFormElement }) => {
		e.preventDefault()
		const input = inputValue.trim()
		if (!input) return
		if (!$selectedAgent) {
			toast.warning('Please select an agent')
			return
		}
		if (input.length < 3 || $loading || renderingMessage) {
			return
		}

		e.currentTarget.reset()

		$messages = [
			...$messages,
			{
				role: 'user',
				content: input,
				createdAt: Date.now()
			}
		]

		$loading = true
		renderingMessage = true
		stopGenerating = false
		chatMessages.scrollTop = chatMessages.scrollHeight
		abortController = new AbortController()

		const headers: Record<string, string> = {
			Authorization: `Bearer ${$credentials.apiKey}`,
			'Content-Type': 'application/json',
			'X-CodeGPT-Source': 'chrome'
		}

		if ($credentials.orgId) headers['CodeGPT-Org-Id'] = $credentials.orgId

		const res = await fetch(`${BASE_API_URL}/chat/completions`, {
			signal: abortController.signal,
			method: 'POST',
			headers,
			body: JSON.stringify({
				stream: true,
				format: 'json',
				messages: $messages,
				agentId: $selectedAgent.id
			})
		})

		if (!res.ok) {
			console.error('Failed to send message')
			$messages = [
				...$messages,
				{ role: 'assistant', content: 'Failed to send message', createdAt: Date.now() }
			]
			$loading = false
			renderingMessage = false
			return
		}

		$isModelStreaming = true

		for await (const chunk of streamReader(res)) {
			if (stopGenerating) {
				break
			}
			if ($messages[$messages.length - 1].role !== 'assistant') {
				$messages = [...$messages, { role: 'assistant', content: '', createdAt: Date.now() }]
				$loading = false
				chatMessages.scrollTop = chatMessages.scrollHeight
			}
			$messages[$messages.length - 1].content += chunk
		}

		$isModelStreaming = false

		scrollToBottom()

		renderingMessage = false
		await setChromeStorage({ [`${$selectedAgent.id}-messages`]: $messages })
	}

	function handleKeyPress(
		e: KeyboardEvent & {
			currentTarget: EventTarget & HTMLTextAreaElement
		}
	) {
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
	class="chat-messages overflow-y-auto hide-scrollbar flex flex-col gap-4 max-h-[calc(100vh-11rem)] py-3"
>
	{#each $messages as { content, role }}
		<section class="grid gap-4 mb-6 px-2">
			{#if role === 'assistant' && selectedAgent}
				<div class="flex items-center gap-2">
					{#if $selectedAgent?.image}
						<img
							src={$selectedAgent?.image}
							alt="Agent"
							class="w-6 h-6 rounded-full object-cover"
						/>
					{:else}
						<div
							class="bg-white text-black rounded-full w-6 h-6 p-1 flex items-center justify-center dark:bg-black dark:text-foreground"
						>
							<Sparkles class="w-full h-auto" />
						</div>
					{/if}
					<b class="text-sm text-gray-11 tracking-wide">{$selectedAgent?.name}</b>
				</div>
			{/if}
			{#if role === 'user'}
				<div class="flex items-center gap-2">
					<img
						src={$user?.avatar_url}
						alt={$user?.full_name}
						class="w-6 h-6 rounded-full object-cover"
					/>
					<b class="text-sm text-gray-11 tracking-wide">{$user?.full_name}</b>
				</div>
			{/if}
			<Markdown {content} />
		</section>
	{/each}
	{#if $loading}
		<button class="btn btn-loading btn-outline btn-xs border w-fit text-gray-500 opacity-80"
			>Thinking</button
		>
	{/if}
</div>

<footer>
	<form on:submit|preventDefault={handleSubmit} class="w-full flex gap-2 p-2">
		<textarea
			name="input"
			class="min-h-10 max-h-40 textarea textarea-solid resize-none text-sm textarea-block"
			rows="1"
			placeholder="Type your message..."
			bind:value={inputValue}
			on:keypress={handleKeyPress}
		/>

		{#if renderingMessage && !$loading}
			<button type="button" class="mt-auto btn btn-error btn-sm" on:click={stopGeneration}>
				Stop
			</button>
		{:else}
			<button
				id="sendButton"
				type="submit"
				class="btn btn-primary btn-sm border-2"
				disabled={$loading || inputValue.trim().length < 1}
			>
				Send
			</button>
		{/if}
	</form>
</footer>
