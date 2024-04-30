<script>
	import { Marked } from 'marked';
	import { markedHighlight } from 'marked-highlight';
	import hljs from 'highlight.js';
	import 'highlight.js/styles/nord.min.css';

	export let content = ''
	
	const marked = new Marked(
		markedHighlight({
			langPrefix: 'hljs language-',
			highlight(code, lang, info) {
				const language = hljs.getLanguage(lang) ? lang : 'plaintext'
				return `<div class="language">${language}</div>` + 
         		hljs.highlight(code, { language }).value
			}
		})
	);

</script>

<div class="markdown overflow-auto">
	{@html marked.parse(content)}
	
</div>

<!-- <script>
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
	};

	onMount(applyCodeBlockClass)
	
</script>

<div class="markdown">
	{@html marked(content, { renderer})}
</div> -->