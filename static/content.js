// src/content.js
import App from '../src/routes/+page.svelte';

const app = document.createElement('div');
app.id = "my-extension-root";
document.body.appendChild(app);

new App({
    target: app
});


// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('hola mundo')
//     if (request.message === "clicked_browser_action") {
//         toggle();
//     }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "activate_extension") {
        toggleVisibility();
    }
});

function toggleVisibility() {
    if (app.style.display === "none") {
        app.style.display = "block";
    } else {
        app.style.display = "none";
    }
}

toggleVisibility();

// function toggle() {
//     if (app.style.display === "none") {
//         app.style.display = "block";
//     } else {
//         app.style.display = "none";
//     }
// }