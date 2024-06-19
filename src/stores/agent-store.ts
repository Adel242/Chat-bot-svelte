import type { Agent } from '@/types'
import { writable } from 'svelte/store'

interface SelectedAgent {
	id: Agent['id']
	image: Agent['image']
	name: Agent['name']
}

export const selectedAgent = writable<SelectedAgent | null>(null)
