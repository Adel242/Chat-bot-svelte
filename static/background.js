// chrome.runtime.onInstalled.addListener((tab) => {
//     console.log('hola background')
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//         console.log(tabs[0])
//       })
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const activeTab = tabs[0];
//         chrome.tabs.sendMessage(activeTab.id, { "message": "clicked_browser_action" });
//     });
// });

// console.log('hello background afuera')

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error))