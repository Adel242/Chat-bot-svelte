export async function getChromeStorage(keys: string[]) {
	if (!chrome.storage) return null

	try {
		const storage = await chrome.storage.local.get(keys)
		return storage
	} catch (err) {
		console.error(err)
		return null
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function setChromeStorage(items: Record<string, any>) {
	if (!chrome.storage) return

	try {
		await chrome.storage.local.set(items)
	} catch (err) {
		console.error(err)
	}
}

export async function removeChromeStorage(keys: string[] | string) {
	if (!chrome.storage) return

	try {
		await chrome.storage.local.remove(keys)
	} catch (error) {
		console.error(error)
	}
}
