<script lang="ts">
	import LogotypeWide from './LogotypeWide.svelte';
	import { credentials } from '@/stores/credentials-store';
	import Menu from '@/components/menu.svelte';

	export const links = [
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
	] as const;
</script>

<header class="flex gap-0 items-center justify-between p-3 pb-0 border-b-neutral/30">
	<!-- <a href="/"> -->
		<LogotypeWide currentColor="white" class="h-3" />
	<!-- </a> -->
	<nav class="flex items-center gap-4">
		<Menu apiKey={$credentials.apiKey} />
	</nav>
</header>

<!-- {#each links as { url, label, auth } (url)}
			<a
				class:hidden={auth && !$credentials.apiKey}
				class="text-sm font-semibold text-foreground
				{$page.route.id === url && 'link-primary'}"
				href={url}
			>
				{label}
			</a>
	{/each} -->
