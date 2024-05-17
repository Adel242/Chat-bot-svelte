<script lang="ts">
	import { page } from '$app/stores'
	import LogotypeWide from './LogotypeWide.svelte'

	const links = [
		{
			url: '/',
			label: 'Home',
		},
		{
			url: '/settings',
			label: 'sign in'
		}
	] as const
</script>

<header class="flex gap-2 items-center justify-between p-3 border-b-neutral/30 border-b">
	<a href="/">
		<LogotypeWide currentColor='white' class='h-3'/>
	</a>
	<nav class="flex items-center justify-between gap-4">
		{#each links as { url, label } (url)}
			<a
				class="text-sm font-semibold text-foreground
					{$page.route.id === url && 'link-primary'}"
				href={url}
			>
				{label}
			</a>
		{/each}
	</nav>
</header>