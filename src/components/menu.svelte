<script lang="ts">
	import { user } from '../stores/users-store'
	import { linksNav } from '@/stores/links-store'
	import { removeChromeStorage } from '$lib/chrome-storage'
	import { credentials } from '../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'

	export let apiKey

	linksNav.set([])

	const handleSignOut = async () => {
		credentials.set({ apiKey: '', orgId: '' })
		await removeChromeStorage(['apiKey', 'orgId'])
		await chrome.storage.local.clear()
		toast.success('Signed out successfully')
		goto('/settings')
	}
</script>

{#if apiKey}
	<div class="dropdown">
		<button class="btn my-1" tabindex="0">
			<img src={$user?.avatar_url} alt={$user?.full_name} class="w-6 h-6 rounded-full" />
			<div class="ml-2">{$user?.full_name}</div>
		</button>
		<div class="dropdown-menu dropdown-menu-bottom-left origin-top-right w-[100%]">
			<a
				href="https://staging.codegpt.co/es"
				class="dropdown-item text-sm flex justify-end items-start"
				target="_blank"
				rel="noopener noreferrer">Go to Code GPT</a
			>
			<button
				class="dropdown-item text-sm flex justify-end items-start dropdown-divider"
				on:click={handleSignOut}>Sign out</button
			>
		</div>
	</div>
{/if}
