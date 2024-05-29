<!-- MenuComponent.svelte -->
<script lang="ts">
	import { user } from '../stores/users-store';
	import { linksNav } from '@/stores/links-store';
	import { removeChromeStorage } from '$lib/chrome-storage';
	import { credentials } from '../stores/credentials-store';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	export let apiKey;

	linksNav.set([]);

	const handleSignOut = async () => {
		credentials.set({ apiKey: '', orgId: '' });
		await removeChromeStorage(['apiKey', 'orgId']);
		await chrome.storage.local.clear();
		toast.success('Signed out successfully');
		goto('/settings');
	};
</script>

{#if apiKey}
	<div class="dropdown">
		<button class="btn my-1" tabindex="0">
			<img src={$user?.avatar_url} alt={$user?.full_name} class="w-6 h-6 rounded-full" />
			<div class="ml-2">{$user?.full_name}</div>
		</button>
		<div class="dropdown-menu dropdown-menu-bottom-left origin-top-right w-[100%] ">
			<a href="https://staging.codegpt.co/es" class="dropdown-item text-sm flex justify-end items-start" target="_blank" rel="noopener noreferrer">Go to Code GPT</a>
			<button class="dropdown-item text-sm flex justify-end items-start dropdown-divider" on:click={handleSignOut}>Sign out</button>
		</div>
	</div>
{/if}

<!-- {#if apiKey}
	<section class="menu-section">
		<ul class="menu-items">
			<li>
				<input type="checkbox" id="menu-1" class="menu-toggle" />
				<label class="menu-item" for="menu-1">
					<span class="flex aling-item-center">
						<img src={$user?.avatar_url} alt={$user?.full_name} class="w-6 h-6 rounded-full" />
						<div class="ml-2">{$user?.full_name}</div>
					</span>
				</label>
				<div class="menu-item-collapse absolute right-0 origin-top-right bg-gray-800">
					<div class="min-h-0 flex flex-col justify-end items-end">
						// manejo del redenderizado
						{#each $linksNav as { $url, $label, $auth } ($url)}
							<a
								class:hidden={$auth && !apiKey}
								class=" menu-item text-sm font-semibold text-foreground p-1 pr-6 {$page.route.id === $url && 'link-primary'}" href={$url}>
								{$label}
							</a>
						{/each}
						<button class="menu-item ml-12" on:click={handleSignOut}>Sign out</button>
					</div>
				</div>
			</li>
		</ul>
	</section>
{/if} -->
