<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import { credentials } from '../stores/credentials-store'
	import { Toaster, toast } from 'svelte-sonner'
	import Navbar from '../components/navbar.svelte'
	import { getChromeStorage, removeChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { fetchUserData } from '../services/users'
	import { user } from '../stores/users-store'
	import { goto } from '$app/navigation'
	import type { AuthSession } from '@supabase/supabase-js'
	import { supabase } from '@/lib/supabase/client'
	import { page } from '$app/stores'

	credentials.subscribe(async ({ apiKey }) => {
		if (!apiKey) {
			return
		}
		const userData = await fetchUserData(apiKey)
		if (!userData) {
			toast.error('Please insert API key valid', { position: 'bottom-center' })
			user.set(null)
			return
		}
		// toast.success('Connection Success')
		user.set(userData)
	})

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (!storage) {
			goto('/settings')
			return
		}

		const apiKey = storage['apiKey'] ?? ''
		const orgId = storage['orgId'] ?? ''

		credentials.set({ apiKey, orgId })

		if (apiKey) {
			goto('/')
		} else {
			goto('/settings')
		}

		if (!apiKey) return
		const userData = await fetchUserData(apiKey)
		if (!userData) {
			toast.error('Invalid API key')
			user.set(null)
			credentials.set({ apiKey: '', orgId: '' })
			await removeChromeStorage(['apiKey', 'orgId'])
			goto('/settings')
			return
		}
		user.set(userData)
	})

	let session: AuthSession | null

	onMount(() => {
		supabase.auth.onAuthStateChange(async (_event, _session) => {
			const pathname = $page.url.pathname
			session = _session
			if (session) {
				await setChromeStorage({ apiKey: session.access_token, orgId: '' })
				credentials.set({ apiKey: session.access_token, orgId: '' })
				if (pathname !== '/') goto('/')
			}
		})
	})
</script>

<div class="h-dvh w-dvw min-h-[36rem] grid grid-rows-[auto_1fr] mx-auto layout">
	<Navbar />
	<slot />
</div>

<Toaster
	theme="dark"
	position="bottom-right"
	richColors
	closeButton
	visibleToasts={1}
	toastOptions={{
		duration: 1000
	}}
/>

<style>
	@media (max-width: 240px) {
		.layout {
			min-width: 24rem;
		}
	}
</style>
