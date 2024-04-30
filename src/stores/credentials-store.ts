import { writable } from 'svelte/store';

export const credentials = writable({
	apiKey: '',
	orgId: ''
})
