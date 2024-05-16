<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { credentials } from '../stores/credentials-store';
	import { Toaster, toast } from 'svelte-sonner';
	import Navbar from '../components/navbar.svelte';
	import { getChromeStorage } from '$lib/chrome-storage';
	import { fetchUserData } from '../services/users';
	import { user } from '../stores/users-store';

	credentials.subscribe(async ({ apiKey }) => {
		if (!apiKey) {
			return
		}
		const userData = await fetchUserData(apiKey)
		if (!userData) {
			toast.error('Please insert API key valid', { position: 'bottom-center'})
			user.set(null)
			return
		}
		toast.success('Connection Success')
		user.set(userData)
	});

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (!storage) return

		const apiKey = storage['apiKey'] ?? ''
		const orgId = storage['orgId'] ?? ''

		credentials.set({ apiKey, orgId })

		if (!apiKey) return
		const userData = await fetchUserData(apiKey)
		if (!userData) {
			toast.error('Invalid API key')
			user.set(null)
			return
		}
		user.set(userData)
	});
</script>

<div class="h-[36rem] grid grid-rows-[auto_1fr] mx-auto">
	<Navbar />
	<slot />
</div>

<Toaster theme="dark" position="bottom-center" richColors closeButton />
