<script lang="ts">
	import { page } from '$app/stores';
	import LogotypeWide from './LogotypeWide.svelte';
	import {credentials} from '@/stores/credentials-store';


	const links = [
		{
			url: '/',
			label: 'Chat',
			auth: true
		},
		{
			url: '/settings',
			label: 'sign in',
			auth: false
		}
		
	] as const
</script>

<header class="flex gap-2 items-center justify-between p-3 border-b-neutral/30 border-b">
	<!-- <a href="/"> -->
		<LogotypeWide currentColor='white' class='h-3'/>
	<!-- </a> -->
	<nav class="flex items-center justify-between gap-4">
		{#each links as { url, label, auth } (url)}
			<a class:hidden={auth && !$credentials.apiKey}
				class="text-sm font-semibold text-foreground
					{$page.route.id === url && 'link-primary'}"
				href={url}
			>
				{label}
			</a>
		{/each}
	</nav>
</header>