<script lang="ts">
	import { BASE_API_URL } from '$lib/api'
	import { users } from '../stores/users-store'
	import { toast } from 'svelte-sonner'

	const fetchUserData = async (apiKey: string) => {
		const res = await fetch(`${BASE_API_URL}/user`, {
			headers: {
				Authorization: `Bearer ${apiKey}`
			}
		})
		const data = await res.json()
		users.set(data)
		if (!res.ok) {
			toast.error('Error fetching user data')
		}
		
	users.set(data);
	}


</script>
