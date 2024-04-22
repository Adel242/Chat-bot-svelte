<script>
	// import { marked } from 'marked'
	import SvelteMarkdown from 'svelte-markdown'

	export let content = ''
</script>

<div class="markdown">
	<SvelteMarkdown source={content} />
</div>

<style>
	.markdown > p {
		margin: 0; 
	}

    .markdown  > div:first-child {
        background-color: rgb(9, 9, 11, 0.4); 
        border-radius: 0.5rem 0.5rem 0 0;
    }

    pre:has(div.markdown) {
    padding: 0;
    margin: 1rem 0;
}

	.markdown > pre {
        border-radius: 0 0 0.5rem 0.5rem !important;
        width: 100%;
		background-color: rgb(0, 0, 0);
		color: #ffffff
	}

	.markdown > code {
		
	}

	/* Table stile */
	.markdown > table {
		border-collapse: separate;
		border-spacing: 0;
		width: 100%;
		border-color: #d9d9e3;
		margin-bottom: 1rem;
		caption-side: bottom;
		margin-top: 1rem;
	}

	.markdown > thead,
	.markdown > tbody,
	.markdown > tfoot,
	.markdown > tr,
	.markdown > td,
	.markdown > th {
		border-color: inherit;
		border-style: solid 2px #d9d9e3;
		border-width: 0;
	}

	.markdown > th:first-child {
		border-top-left-radius: 0.375rem;
	}

	.markdown > th:last-child {
		border-top-right-radius: 0.375rem;
		border-right-width: 1px;
	}

	.markdown > th {
		background-color: rgba(236, 236, 241, 0.2);
		border-bottom-width: 1px;
		border-left-width: 1px;
		border-top-width: 1px;
		padding: 0.25rem 0.75rem;
	}

	.markdown > thead tr th {
		color: inherit;
	}

	.markdown > tbody tr:last-child td:first-child {
		border-bottom-left-radius: 0.375rem;
		border-left-width: 1px;
	}

	.markdown > tbody tr:last-child td:last-child {
		border-bottom-right-radius: 0.375rem;
		border-right-width: 1px;
	}

	.markdown > td {
		border-bottom-width: 1px;
		border-left-width: 1px;
		padding: 0.25rem 0.75rem;
		font-size: 0.9rem;
	}

	.markdown > td:last-child {
		border-right-width: 1px;
	}
</style>
