<script>
	import { marked } from 'marked'
	import renderer from '../../lib/renderer'
	import { onMount } from 'svelte'

	export let content = ''

	// export const renderer = new marked.Renderer()
	function applyCodeBlockClass() {
		const preElements = document.querySelectorAll('.markdown pre')
		const codeElements = document.querySelectorAll('.markdown code')

		preElements.forEach((pre) => {
			pre.classList.add('code-block')
		})

		codeElements.forEach((code) => {
			code.classList.add('code-block')
		})
	}

	onMount(applyCodeBlockClass)
	
</script>

<div class="markdown">
	{@html marked(content, { renderer})}
</div>