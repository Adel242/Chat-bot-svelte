chrome.contextMenus.onClicked.addListener(genericOnClick)

function genericOnClick(info, tab) {
	if (info.menuItemId == 'selection') {
		let text = info.selectionText
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			let body = {
				text: text,
				favIconUrl: tabs[0].favIconUrl,
				title: tabs[0].title,
				url: tabs[0].url
			}
			console.log('Message sent', { body })
		})
	}

	if (info.menuItemId == 'page') {
		chrome.scripting.executeScript(
			{
				target: { tabId: tab.id },
				files: ['content.js']
			},
			() => {
				chrome.tabs.sendMessage(tab.id, { action: 'getClickedElement' }, function (response) {
					if (chrome.runtime.lastError) {
						console.error(chrome.runtime.lastError.message)
					} else if (response && response.elementHTML) {
						chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
							let body = {
								text: response.elementHTML,
								favIconUrl: tabs[0].favIconUrl,
								title: tabs[0].title,
								url: tabs[0].url
							}
							console.log('Message sent', { body })
						})
					}
				})
			}
		)
	}
}

chrome.runtime.onInstalled.addListener(function () {
	let contexts = ['selection', 'page']
	for (let i = 0; i < contexts.length; i++) {
		let context = contexts[i]
		let title = `Add ${context} to chat`
		chrome.contextMenus.create({
			title: title,
			contexts: [context],
			id: context
		})
	}
})

chrome.runtime.onMessage.addListener(function (message) {
	console.log('Content from the web page: ', message.content)
	// Process the content as needed, perhaps send it to the sidePanel for display
})

// // Content script to handle the message and get the clicked element
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
// 	if (request.action === 'getClickedElement') {
// 		document.addEventListener(
// 			'click',
// 			function (event) {
// 				let elementHTML = event.target.outerHTML
// 				sendResponse({ elementHTML: elementHTML })
// 				console.log('Element HTML: ', elementHTML)
// 			},
// 			{ once: true }
// 		)
// 	}
// })
