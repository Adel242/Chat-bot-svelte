<script lang="ts">
	import { user } from '../stores/users-store'
	import { linksNav } from '@/stores/links-store'
	import { removeChromeStorage } from '$lib/chrome-storage'
	import { credentials } from '../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'
	import { loading } from '../stores/loading-store'

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
		<button
			class={`btn btn-circle btn-outline bg-transparent p-0`}
			tabindex="0"
			style="background-color: transparent;"
		>
			<div class="flex items-center gap-2 w-8 h-8 rounded-full">
				{#if $user?.avatar_url}
					<img src={$user?.avatar_url} alt="user avatar" class="w-8 h-8 rounded-full" />
				{/if}
			</div>
		</button>

		<!-- dropdown-item -->
		<div class="dropdown-menu dropdown-menu-bottom-left origin-top-right min-w-40 w-[100%]">
			<a
				href="https://app.codegpt.co"
				class="dropdown-item text-sm flex justify-end items-start"
				target="_blank"
				tabindex="-1"
				rel="noopener noreferrer">Go to Code GPT</a
			>
			<a
				href="/settings"
				tabindex="-1"
				class="dropdown-item text-sm flex justify-end items-start"
				on:click={handleSignOut}>Sign out</a
			>
		</div>
	</div>
{/if}
