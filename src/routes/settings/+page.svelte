<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { credentials } from '../../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { getChromeStorage, setChromeStorage } from '$lib/chrome-storage'
	import { BASE_API_URL } from '@/lib/api'

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (storage) {
			let apiKey = storage['apiKey'] ?? ''
			let orgId = storage['orgId'] ?? ''
			credentials.set({ apiKey, orgId })
		}
	})

	const handleSubmit = async (e: SubmitEvent) => {
		const form = e.currentTarget as HTMLFormElement
		const formData = new FormData(form)
		const apiKey = String(formData.get('apiKey')) ?? ''
		const orgId = String(formData.get('orgId')) ?? ''

		if (!apiKey) {
			toast.warning('Please enter an api key')
			return
		}

		const res = await fetch(`${BASE_API_URL}/apikeys/${apiKey}`)
		if (!res.ok) {
			toast.error('invalid Api Key')
			return
		}

		credentials.set({ apiKey, orgId })
		await setChromeStorage({ apiKey, orgId })
		goto('/')
	}
</script>

<main class="flex flex-col h-full items-center justify-center">
	<div class="w-full sm:max-w-md m-auto grid gap-2 justify-center">
		<section class="grid gap-2">
			<h1 class="font-bold">Sign In</h1>
			<form class="card" on:submit|preventDefault={handleSubmit}>
				<div class="card-body">
					<div class="grid gap-2">
						<div class="w-full grid gap-2">
							<label for="apiKey" class="text-xs text-gray-300">ApiKey</label>
							<input
								value={$credentials.apiKey}
								class="input max-w-full"
								placeholder="sk-*****"
								type="password"
								id="apiKey"
								name="apiKey"
							/>
							<small class="text-xs text-gray-500"></small>
						</div>
						<div class="w-full grid gap-2">
							<label for="orgId" class="text-xs text-gray-300">Org ID – Optional</label>
							<input
								value={$credentials.orgId}
								class="input max-w-full"
								placeholder="organization ID"
								type="text"
								id="orgId"
								name="orgId"
							/>
						</div>
					</div>
					<div class="card-footer">
						<button type="submit" class="btn btn-primary btn-sm">Sign In</button>
					</div>
				</div>
			</form>
		</section>
		<section>
			<p class="flex text-xs text-gray-12 gap-2 items-center justify-between px-2">
				<a href="https://app.codegpt.co/en/apikeys" target="_blank">
					Get your Api key <u>here</u>
				</a>
				<a
					href="https://intercom.help/codegpt/en/articles/9424841-where-do-i-find-my-codegpt-api-key"
					target="_blank"
					class="flex items-center gap-1"
				>
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
