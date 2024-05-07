# Description
Este es un bot de chat construido como una extensión para Google Chrome, diseñado para interactuar con agentes especializados creados por CODE-GPT. Cada agente está entrenado para manejar información específica utilizando el modelo de lenguaje de CODE-GPT.

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte)
If you want more information about svelte visit the website [`svelte`](https://svelte.dev/docs/introduction)

# Getting Started
Before you start using this extension, make sure you have a valid CodeGPT or OpenAI API Key. You can obtain them from the following links:
- **CodeGPT API Key**: [Get CodeGPT API Key](https://codegpt.co)
- **OpenAI API Key**: [Get OpenAI API Key](https://openai.com/blog/openai-api)

Optionally, you can request an Organization ID through CodeGPT.  

# Requirements
Before starting, make sure you have the following programs installed:
Node.js (version 18 or higher)
Google Chrome (latest version)

# Installation
 1. Clone this repository to your local machine:
```bash 
git clone https://github.com/JudiniLabs/Code-GPT-Chrome-extension.git
```

2. Navigate to the project directory:
 ```bash 
cd Code-GPT-Chrome-extension
```
3. Install the project dependencies using pnpm or npm:

```bach
pnpm install or npm install
```

# Development
To start the application in development mode, run one of the following commands:
```bach
pnpm dev or npm run dev
```
The application will be available at http://localhost:5173 for pnpm or http://localhost:3000 for npm .

##Getting Started with create-svelte

# Production Build
To build the application for production, run one of the following commands:

```bach
pnpm build or npm run build
```

# Loading the Extension in Google Chrome
1.Open Google Chrome and navigate to chrome://extensions/.
2.Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select the file 'build' directory of the project.
The extension will be loaded into your Chrome browser.

# Using the Extension
1. Open a new tab in Google Chrome.
2. Click the CodeGPT Chat extension icon in the toolbar to open the chat window.
3. Enter your ChatGPT or OpenAI API key on the 'Login' page. located at the top of the extension. (You can also enter your org id, but this is not mandatory)
4. Select an intelligent agent from the dropdown list.
5. Start chatting with the selected agent.

# Key Features

- Specialized Intelligent Agents: The application allows you to interact with intelligent agents trained using RAG techniques, enabling them to provide relevant and accurate responses in various knowledge areas.
- Markdown Rendering and Syntax Highlighting: The application renders Markdown content and highlights code syntax, improving readability and user experience when visualizing formatted content, such as tables, code snippets, etc.
- Conversation Storage: Conversations with the agents are stored in Chrome's local storage, allowing you to resume your conversations at any time.
- Agent Selection: You can select different intelligent agents based on your needs, each specialized in a specific area.


> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
