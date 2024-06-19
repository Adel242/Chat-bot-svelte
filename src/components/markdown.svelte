<script lang="ts">
	import { Marked } from 'marked'
	import { markedHighlight } from 'marked-highlight'
	import hljs from 'highlight.js'
	import 'highlight.js/styles/nord.min.css'
	export let content = ''

	$: {
		if (content) {
			content = content.replace(/\\"/g, '"')
		}
	}

	const marked = new Marked(
		markedHighlight({
			langPrefix: 'grid language-',
			highlight(code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext'
				return (
					`<div class='rounded-lg border border-border w-full max-w-full min-w-full whitespace-pre-wrap items-start grid gap-2'>` +
					`<header class="flex items-center p-2 border-b border-b-border">

						<div class='flex items-center gap-1'>
							<div class="flex w-4 h-4 text-gray-8">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" ><path d="m384-336 56-57-87-87 87-87-56-57-144 144 144 144Zm192 0 144-144-144-144-56 57 87 87-87 87 56 57ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg>
							</div>
							<span class='uppercase text-xs'>${language}</span>
						</div>

					</header>
					<div class='code p-2'>` +
					hljs.highlight(code, { language }).value +
					'</div>' +
					'</div>'
				)
			}
		})
	)
</script>

<div class="highlight-content markdown grid gap-4">
	{@html marked.parse(content)}
</div>
