import { marked } from 'marked'

const renderer = new marked.Renderer()

// Personalizar el renderizado de bloques de código
renderer.code = (code, language) => {
  return `<div class="code-block">
            <div class="code-header">${language || ''}</div>
            <pre><code>${code}</code></pre>
          </div>`
}

// Personalizar el renderizado de líneas de código
renderer.codespan = (code) => {
  return `<code class="inline-code">${code}</code>`
}

renderer.link = function (href, title, text) {
  const titleProp = title ? ` title="${title}"` : ''
  return `<a target="_blank" class="underline" href="${href}"${titleProp}>${text}</a>`
}

export default renderer