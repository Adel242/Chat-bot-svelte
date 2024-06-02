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
			langPrefix: 'language-',
			highlight(code, lang) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext'
				return (
					`<div class="language flex items-center">
						<div class="language-icon flex pr-1 pl-1">
							<svg xmlns="http://www.w3.org/2000/svg" 
								width="12" 
								height="12" 
								viewBox="0 0 24 20" 
								fill="none"
								stroke="currentColor" 
								stroke-width="2" 
								stroke-linecap="round" 
								stroke-linejoin="round"
								class="icon icon-tabler icons-tabler-outline icon-tabler-code">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M7 8l-4 4l4 4" />
								<path d="M17 8l4 4l-4 4" />
								<path d="M14 4l-4 16" />
							</svg>
						</div>
						<span <class="item-center">${language}</span>
					</div>` + hljs.highlight(code, { language }).value
				)
			}
		})
	)
</script>

<div class="highlight-content markdown grid gap-3">
	{@html marked.parse(content)}
</div>
