<script lang="ts">
	import { isModelStreaming } from '../stores/is-model-streaming-store'
	import { loading } from '../stores/loading-store'
	import { messages } from '../stores/messages-store'
</script>

<button
	on:click
	id="chat-delete"
	class="btn btn-solid btn-sm"
	class:hidden={$messages.length === 0}
	disabled={$loading || $isModelStreaming}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		height="16px"
		viewBox="0 -960 960 960"
		width="16px"
		fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg
	>
	<span class="text-xs">New Chat</span>
</button>
