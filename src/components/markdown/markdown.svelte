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

<!-- <style global>
	.markdown .code-block {
		background-color: rgba(10, 10, 12, 0.4);
		border-radius: 0.5rem;
		margin: 1rem 0;
	}

	.markdown code {
		background-color: rgb(9, 9, 11, 0.6);
		color: #4912e1;
		padding: 0.5rem 1rem;
		border-radius: 0.5rem 0.5rem 0 0;
	}

	.markdown pre {
		background-color: rgb(0, 0, 0);
		color: #f80404;
		padding: 1rem;
		border-radius: 0 0 0.5rem 0.5rem;
		margin: 0;
	}

	.markdown .inline-code {
		background-color: rgb(9, 9, 11, 0.4);
		color: #fff;
		padding: 0.2rem 0.4rem;
		border-radius: 0.25rem;
	}

	/* tables ↓ */
	.markdown table {
		border-collapse: separate;
		border-spacing: 0;
		width: 100%;
		border-color: #d9d9e3;
		margin-bottom: 1rem;
		caption-side: bottom;
		margin-top: 1rem;
	}

	.markdown thead,
	.markdown tbody,
	.markdown tfoot,
	.markdown tr,
	.markdown td,
	.markdown th {
		border-color: inherit;
		border-style: solid;
		border-width: 0;
	}

	.markdown th:first-child {
		border-top-left-radius: 0.375rem;
	}

	.markdown th:last-child {
		border-top-right-radius: 0.375rem;
		border-right-width: 1px;
	}

	.markdown th {
		background-color: rgba(236, 236, 241, 0.2);
		border-bottom-width: 1px;
		border-left-width: 1px;
		border-top-width: 1px;
		padding: 0.25rem 0.75rem;
	}

	.markdown thead tr th {
		color: inherit;
	}

	.markdown tbody tr:last-child td:first-child {
		border-bottom-left-radius: 0.375rem;
		border-left-width: 1px;
	}

	.markdown tbody tr:last-child td:last-child {
		border-bottom-right-radius: 0.375rem;
		border-right-width: 1px;
	}

	.markdown td {
		border-bottom-width: 1px;
		border-left-width: 1px;
		padding: 0.25rem 0.75rem;
		font-size: 0.9rem;
	}

	.markdown td:last-child {
		border-right-width: 1px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.fadeIn {
		animation-name: fadeIn;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}
</style> -->
