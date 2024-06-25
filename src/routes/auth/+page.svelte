<script lang="ts">
	import { BASE_API_URL } from '@/lib/api'
	import { onMount } from 'svelte'
	import { credentials } from '@/stores/credentials-store'
	import { setChromeStorage } from '$lib/chrome-storage'
	import { goto } from '$app/navigation'
	import { browser } from '$app/environment'

	onMount(async () => {
		const isEdge = navigator.userAgent.indexOf('Edg/') !== -1

		const connectionId = crypto.randomUUID()

		const url = `https://app.codegpt.co/login?source=chrome&connection_id=${connectionId}`

		let windowId

		if (isEdge) {
			await chrome.windows.create({ url, type: 'popup' }, ({ id }) => {
				windowId = id
			})
		} else {
			await chrome.tabs.create({ url, active: true })
		}

		const es = new EventSource(`${BASE_API_URL}/extensions/connection/${connectionId}`)

		es.onmessage = async (e) => {
			const data = JSON.parse(e.data)
			credentials.set({ apiKey: data.access_token, orgId: '' })
			await setChromeStorage({ apiKey: data.access_token, orgId: '' })

			if (isEdge && windowId) {
				await chrome.windows.remove(windowId)
			}
			goto('/')
			es.close()
		}
	})
</script>

<main class="flex flex-col h-full items-center justify-center">
	<div class="w-full sm:max-w-md m-auto grid gap-2 justify-center">
		<section class="grid gap-2">
			<h1 class="font-bold">CodeGPT Connect</h1>
			<div class="card">
				<div class="grid card-body justify-center text-center">
					<p>Please press the button "connect account" in your browser to connect to CodeGPT</p>
					<button class="btn btn-loading btn-outline border w-fit text-gray-11 mx-auto"
						>Connecting to CodeGPT</button
					>
				</div>
			</div>
		</section>
		<section>
			<p class="flex text-xs text-gray-11 gap-2 items-center justify-between px-2">
				<a href="https://intercom.help/codegpt/en/" target="_blank" class="flex items-center gap-1">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="16px"
						width="16px"
						viewBox="0 -960 960 960"
						fill="#5f6368"
						><path
							d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
						/></svg
					>
					Help
				</a>
			</p>
		</section>
	</div>
</main>
