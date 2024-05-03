<script lang="ts">
	import { page } from '$app/stores'
	import Agents from '../components/agents.svelte'

	const links = [
		{
			url: '/',
			label: 'Home',
			// img: '/favicon-16.png'
		},
		{
			url: '/settings',
			label: 'Log in'
		}
	] as const
</script>

<div class="navbar">
	<div class="navbar-start">
		<a class=" flex gap-2 items-center" href="/">
			<img src="/favicon-16.png" class="w-5 ml-1  aspect-square" alt="CodeGPT Logo" />
		</a>
	</div>
	<div class="w-full h-5 flex flex-grow" style="cursor: pointer;">
		<!-- <img src="/favicon-16.png" class="w-4 aspect-square" alt="CodeGPT Logo" /> -->
		<Agents />
	</div>
	<div class="navbar-end">
		{#each links as { url, label } (url)}
			<a
				class="navbar-item
        		{$page.route.id === url && 'link-primary'}"
				href={url}
			>
				{label}
			</a>
		{/each}
	</div>
</div>

<style>
	.navbar {
		padding: 0;
	}

	.navbar-end {
		padding: 0;
	}

	.navbar-start{
		width: 3rem
	}
</style>
