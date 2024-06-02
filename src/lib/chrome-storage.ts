export async function getChromeStorage(keys: string[]) {
	if (!chrome.storage) {
		const storage: Record<string, unknown> = {}

		for (const key of keys) {
			const item = localStorage.getItem(key)

			if (!item) continue

			try {
				const data = JSON.parse(item)
				storage[key] = data
			} catch (error) {
				continue
			}
		}

		if (Object.keys(storage).length === 0) return null

		return storage
	} else {
		try {
			const storage = await chrome.storage.local.get(keys)
			return storage
		} catch (err) {
			console.error(err)
			return null
		}
	}
}

export async function setChromeStorage(items: Record<string, unknown>) {
	if (Object.keys(items).length === 0) return

	if (!chrome.storage) {
		for (const key in items) {
			const item = items[key]

			if (!item) continue

			localStorage.setItem(key, JSON.stringify(item))
		}
	} else {
		try {
			await chrome.storage.local.set(items)
		} catch (err) {
			console.error(err)
		}
	}
}

export async function removeChromeStorage(keys: string[] | string) {
	if (Object.keys(keys).length === 0) return

	if (!chrome.storage) {
		for (const key of keys) {
			localStorage.removeItem(key)
		}
	} else {
		try {
			await chrome.storage.local.remove(keys)
		} catch (error) {
			console.error(error)
		}
	}
}
