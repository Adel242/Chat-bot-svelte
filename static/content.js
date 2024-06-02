const webPageContent = document.body.innerText

chrome.runtime.sendMessage({ content: webPageContent })
