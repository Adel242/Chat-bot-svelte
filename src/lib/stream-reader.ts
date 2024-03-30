export async function* streamReader(res: Response) {
	if (!res.body) return

	const reader = res.body.getReader()
	const decoder = new TextDecoder('utf-8')

	let done = false

	let temp = ''
	let content = ''

	while (!done) {
		const { value, done: doneReading } = await reader.read()
		done = doneReading
		const chunkValue = decoder.decode(value)

		const letters = chunkValue.split('')

		for (const letter of letters) {
			temp += letter

			if (temp.slice(-12, -1) === '"content":"' || content !== '') {
				content += letter
				if (content.slice(-2) === '"}') {
					yield content.slice(0, -2).replaceAll('\\n', '\n')
					content = ''
				}
			}
		}
	}
}
