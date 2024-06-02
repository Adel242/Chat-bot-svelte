chrome.sidePanel
	.setPanelBehavior({ openPanelOnActionClick: true })
	.catch((error) => console.error(error))

chrome.runtime.onMessage.addListener(function (message) {
	console.log('Content from the web page: ', message.content)
	// Process the content as needed, perhaps send it to the sidePanel for display
})
