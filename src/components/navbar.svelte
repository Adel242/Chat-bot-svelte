<script lang="ts">
	import LogotypeWide from './LogotypeWide.svelte'
	import { credentials } from '@/stores/credentials-store'
	import Menu from '@/components/menu.svelte'

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
	] as const
</script>

<header class="h-14 flex items-center justify-between p-2 border-b border-b-border">
	<LogotypeWide currentColor="currentColor" class="h-3" />
	<nav>
		<Menu apiKey={$credentials.apiKey} />
	</nav>
</header>
