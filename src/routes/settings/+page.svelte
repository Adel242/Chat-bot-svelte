<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { credentials } from '../../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { getChromeStorage, setChromeStorage, removeChromeStorage } from '$lib/chrome-storage'
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
		const data = await res.json()

		credentials.set({ apiKey, orgId })
		await setChromeStorage({ apiKey, orgId })
		goto('/')
	}

</script>

<main class="flex flex-col h-full items-center justify-center">
	<div class="max-w-md m-auto grid gap-2">
		<section class="w-full">
			<h1 class="font-bold">Sign In</h1>
		</section>
		<section>
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
							<label for="orgId" class="text-xs text-gray-300">Org ID – Optional</label>
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
	</div>
</main>
