<script lang="ts">
	import { page } from '$app/stores'

	const links = [
		{
			url: '/',
			label: 'Home'
		},
		{
			url: '/settings',
			label: 'Settings'
		}
	] as const
</script>

<div class="navbar">
	<div class="navbar-start">
		<a class="navbar-item py-0 px-2 flex gap-2 items-center" href="/">
			<img src="/favicon-16.png" class="w-4 aspect-square" alt="CodeGPT Logo" />
			CodeGPT
		</a>
	</div>
	<div class="navbar-end">
		{#each links as { url, label } (url)}
			<a
				class="
        navbar-item py-0 px-2
        {$page.route.id === url && 'link link-primary'}
      "
				href={url}
			>
				{label}
			</a>
		{/each}
	</div>
</div>
