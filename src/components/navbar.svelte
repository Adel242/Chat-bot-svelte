<script lang="ts">
	import { page } from '$app/stores';
	import LogotypeWide from './LogotypeWide.svelte';
	import { credentials } from '../stores/credentials-store';
	import Agents from './agents.svelte'

	const links = [
		{
			url: '/',
			label: 'Chat',
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
		{#if url === '/settings' || $credentials.apiKey}
        <a
          class="text-sm font-semibold text-foreground
            {$page.url.pathname === url && 'link-primary'}" 
          href={url}
        >
          {label}
        </a>
      {/if}
				
	
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
