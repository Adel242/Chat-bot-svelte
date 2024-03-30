<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { credentials } from '../../stores/credentials-store'
	import { toast } from 'svelte-sonner'
	import { getChromeStorage, setChromeStorage } from '$lib/chrome-storage'

	onMount(async () => {
		const storage = await getChromeStorage(['apiKey', 'orgId'])
		if (storage) {
			let apiKey = storage['apiKey'] === 'null' ? '' : storage['apiKey']
			let orgId = storage['orgId'] === 'null' ? '' : storage['orgId']
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

		credentials.set({ apiKey, orgId })
		await setChromeStorage({ apiKey, orgId })
		goto('/')
	}
</script>

<main class="flex flex-col h-full items-center justify-center">
	<section class="bg-gray-900 rounded-lg">
		<div class="p-8 shadow-lg">
			<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
				<div class="w-full grid gap-2">
					<label for="apiKey" class="ml-2">ApiKey</label>
					<input
						value={$credentials.apiKey}
						class="input input-solid max-w-full"
						placeholder="Your apikey"
						type="password"
						id="apiKey"
						name="apiKey"
					/>
				</div>

				<div class="w-full grid gap-2">
					<label for="orgId" class="ml-2">Org ID</label>
					<input
						value={$credentials.orgId}
						class="input input-solid max-w-full"
						placeholder="Your org id"
						type="text"
						id="orgId"
						name="orgId"
					/>
				</div>

				<div class="mt-4">
					<button type="submit" class="rounded-lg btn btn-solid-primary btn-block">Save</button>
				</div>
			</form>
		</div>
	</section>
</main>
