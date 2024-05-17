<script lang="ts" src="https://cdn.tailwindcss.com ">
	import { streamReader } from '../lib/stream-reader';
	import type { Message } from '../types';
	// import Loader from './loader.svelte';
	import { BASE_API_URL } from '$lib/api';
	import { credentials } from '../stores/credentials-store';
	import { getChromeStorage, removeChromeStorage, setChromeStorage } from '$lib/chrome-storage';
	import { selectedAgent } from '../stores/agent-store';
	import { toast } from 'svelte-sonner';
	import Markdown from './markdown.svelte';
	import { avatarAgents } from '../stores/avatarAgents';
	import { user } from '../stores/users-store';
	import Loader from './loader.svelte'
	import CleanChat from './clean-chat.svelte'

	let chatMessages: HTMLDivElement;
	let messages: Message[] = [];
	let loading = false;
	let renderingMessage = false;
	let inputValue = '';
	$: currentAgent = $avatarAgents.find((agent) => agent.id === $selectedAgent);
	let stopGenerating = false;
	let abortController;

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

	const cleanMessages = async () => {
		// const confirmation = confirm('Are you sure you want to delete all chat messages?')
		// if (!confirmation) return
		messages = []
		await removeChromeStorage(`${$selectedAgent}-messages`)
	}

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

	const stopGeneration = () => {
		stopGenerating = true
	}

</script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rippleui@1.12.1/dist/css/styles.css" />

<div
	id="chat-messages"
	bind:this={chatMessages}
	class="chat-messages p-2 overflow-y-auto max-h-[26rem] text-sm"
>
	{#each messages as { content, role }}
		<div class=" mb-3 {role === 'user' ? 'justify-end' : 'justify-start'}">
			<div class="rounded-lg py-0 px-0 max-w-[100]">
				{#if role === 'assistant' && selectedAgent}
					<div class="flex items-center">
						<img src={currentAgent?.image} alt="Agent" class="w-5 h-5 mr-2 rounded-full" />
						<div>{currentAgent?.name}</div>
					</div>
				{/if}
				{#if role === 'user'}
					<div class="flex items-center">
						<img src={$user?.avatar_url} alt={$user?.full_name} class="w-5 h-5 mr-2 rounded-full" />
						<div>{$user?.full_name}</div>
					</div>
				{/if}
				<Markdown {content} />
			</div>
		</div>
	{/each}
	{#if loading}
		<Loader />
	{/if}
</div>

<div class="border-zinc-100 border rounded-md bg-zinc-800 p-1 h-18 mt-auto">
	<form on:submit|preventDefault={handleSubmit} class=" w-full">
		<textarea
			name="input"
			class="w-full bg-zinc-800 resize-none p-1 outline-none rounded-md text-xs"
			placeholder="Type your message..."
			bind:value={inputValue}
			style="font-size: 0.875rem; height: 2.5rem;"
		></textarea>
		<div class=" flex flex-grow justify-between items-end">
			<div class="flex items-ends">
				{#if messages.length}
					<CleanChat on:click={cleanMessages} />
				{/if}
			</div>
			<div class="ml-1">
				{#if renderingMessage && !loading}
					<button
						type="button"
						class="bg-black text-white py-1 px-2 border rounded-md border-red-500 text-xs"
						on:click={stopGeneration}
					>
						Stop
					</button>
				{:else}
					<button
						type="submit"
						class="bg-white text-black py-1 px-2 rounded-md text-xs"
						disabled={loading || inputValue.trim().length < 1}
						style="cursor: pointer;"
					>
						Send
					</button>
				{/if}
			</div>
		</div>
	</form>
</div>
