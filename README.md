# 🔍 Claude Chat Explorer

A CLI tool to fetch and export your Claude.ai chat history to CSV.

## 🚀 Features

- **Fast:** Built with Bun for native performance
- **Local Export:** Downloads your chats directly to a timestamped CSV file
- **Session-based:** Uses your browser cookies to authenticate
- **Privacy-focused:** Direct connection to Claude.ai, no third-party services

## 🛠️ Installation

**Dependency:** [Bun](https://bun.sh) runtime

```bash
# Clone and install
git clone <your-repo-url>
cd claude-chat-explorer
bun install
```

## 📖 Usage

```bash
bun run main --limit 100
```

This fetches your most recent chats (default/configurable via `--limit`) and saves them to:
