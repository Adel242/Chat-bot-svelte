export interface Agent {
	agent_type: 'qa' | 'other' | 'repository' | null
	created_at: string
	description: string | null
	font: string | null
	id: string
	image: string | null
	is_frozen: boolean
	is_public: boolean
	model: string
	name: string
	org_id: string
	palette: string | null
	pincode: string | null
	prompt: string | null
	prompt_library: Json | null
	slug: string
	status: 'published' | 'draft'
	temperature: number
	topk: number
	welcome: string | null
}
export interface Message {
	role: 'user' | 'assistant'
	content: string
	createdAt: number
}

// export interface Renderer {
// 	content?: string | undefined;
// 	renderer: Renderer;
// }

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]
