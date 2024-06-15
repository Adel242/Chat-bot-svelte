// const webPageContent = document.body.innerText

// chrome.runtime.sendMessage({ content: webPageContent })

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === 'getClickedElement') {
		let elementHTML = document.activeElement.outerHTML
		sendResponse({ elementHTML: elementHTML })
	}
})
