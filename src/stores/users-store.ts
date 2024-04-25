import { writable }  from 'svelte/store'
import type { Users } from '../types'

export const users = writable<Users[]>([])
