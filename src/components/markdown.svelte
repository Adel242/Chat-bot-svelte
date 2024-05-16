<script lang="ts">
	import { Marked } from 'marked'
	import { markedHighlight } from 'marked-highlight'
	import hljs from 'highlight.js'
	import 'highlight.js/styles/nord.min.css'

	export let content = ''

	$: {
		if (content) {
			content = content.replace(/\\\"/g, '"')
		}
	}

	const marked = new Marked(
		markedHighlight({
			// hljs
			langPrefix: 'language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext'
				return (
					`<div class='w-full max-w-full rounded-xl bg-[#000]'><div class='flex border-b border-b-content3/30 mb-auto p-3'>
						<p class='flex gap-1 items-center'>
							<svg xmlns="http://www.w3.org/2000/svg"
								width="12"
								height="12"
								viewBox="0 0 24 20"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M7 8l-4 4l4 4" />
								<path d="M17 8l4 4l-4 4" />
								<path d="M14 4l-4 16" />
							</svg>
							<span>${language}</span>
						</p>
					</div>\n<div class='grid w-full text-pretty max-w-full overflow-auto relative bg-transparent hl js px-3 pb-5 language-${language}'>${hljs.highlight(code, { language }).value}</div></div>`
				)
			}
		})
	)
</script>

<div class="markdown grid gap-3">
	{@html marked.parse(content)}
</div>

