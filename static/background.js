chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Content from the web page: ', request.content)
    // Process the content as needed, perhaps send it to the sidePanel for display
})