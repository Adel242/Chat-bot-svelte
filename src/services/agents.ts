import { BASE_API_URL } from '@/lib/api'
import type { Agent } from '@/types'

export async function getAgents({ apiKey, orgId }: { apiKey: string; orgId?: string }) {
	if (!apiKey) return []

	try {
		const headers: HeadersInit = {
			Authorization: `Bearer ${apiKey}`
		}

		if (orgId) headers['CodeGPT-Org-Id'] = orgId

		const res = await fetch(`${BASE_API_URL}/agents`, {
			headers
		})

		if (!res.ok) {
			const error = await res.json()
			console.log(error)
			return []
		}

		const agentsData = (await res.json()) as Agent[]

		return agentsData
	} catch (error) {
		console.log(error)
		return []
	}
}
