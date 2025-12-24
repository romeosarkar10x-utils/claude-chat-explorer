# 🔍 Claude Chat Explorer

**Claude Chat Explorer** is a lightweight, high-performance CLI tool built with [Bun](https://bun.sh) that allows you to fetch your entire chat history from Claude.ai and search through it locally.

Since Claude's native interface doesn't always make it easy to find that one specific code snippet from three weeks ago, this tool indexes your chats into a searchable format on your machine.

## 🚀 Features

- **Blazing Fast:** Powered by Bun's native `fetch` and runtime performance.
- **Local Indexing:** Keeps a local JSON/Markdown cache of your chats for instant searching.
- **No Official API Needed:** Uses your browser session cookies to authenticate.
- **Privacy First:** Your data never leaves your machine; it's a direct connection between you and Anthropic.

## 🛠️ Installation

Ensure you have [Bun](https://bun.sh) installed:

```bash
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash