<script>
	import '../app.css'
	import { onMount } from 'svelte'
	import { credentials } from '../stores/credentials-store'
	import { Toaster } from 'svelte-sonner'
	import Navbar from '../components/navbar.svelte'
	import { getChromeStorage } from '$lib/chrome-storage'

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (storage) {
			const apiKey = storage['apiKey'] ?? ''
			const orgId = storage['orgId'] ?? ''

			credentials.set({ apiKey, orgId })
		}
	})
</script>

<div
	class="w-[24rem] h-[36rem] max-h-[36rem] grid grid-rows-[auto_1fr] bg-slate-800 text-white mx-auto"
>
	<Navbar />
	<slot />
</div>

<Toaster theme="dark" position="top-center" richColors />
