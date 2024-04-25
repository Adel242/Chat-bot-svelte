import { writable }  from 'svelte/store'
import type { Agent } from '../types'

export const avatarAgents = writable<Agent[]>([])
