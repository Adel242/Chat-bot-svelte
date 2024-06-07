<script lang="ts">
	import { BASE_API_URL } from '@/lib/api'
	import { onMount } from 'svelte'
	import { credentials } from '@/stores/credentials-store'
	import { setChromeStorage } from '$lib/chrome-storage'
	import { goto } from '$app/navigation'

	onMount(async () => {
		const connectionId = crypto.randomUUID()

		const url = `http://localhost:3000/login?source=chrome&connection_id=${connectionId}`

		await chrome.tabs.create({ url, active: true })

		const es = new EventSource(`${BASE_API_URL}/extensions/connection/${connectionId}`)

		es.onmessage = async (e) => {
			const data = JSON.parse(e.data)
			credentials.set({ apiKey: data.access_token, orgId: '' })
			await setChromeStorage({ apiKey: data.access_token, orgId: '' })
			goto('/')
			es.close()
		}
	})
</script>

<main class="flex flex-col h-full items-center justify-center">
	<div class="w-full sm:max-w-md m-auto grid gap-2 justify-center">
		<section class="grid gap-2">
			<h1 class="font-bold">Complete the login process...</h1>
			<h2>This page will refresh when the login is done</h2>
		</section>
	</div>
</main>
