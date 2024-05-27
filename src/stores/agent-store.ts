import { writable } from 'svelte/store';

export const selectedAgent = writable<string | null>(null);
