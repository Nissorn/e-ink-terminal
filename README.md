# E-ink Terminal Dashboard

An interactive, high-contrast terminal dashboard optimized for Android E-reader devices.

## Features

- **High Contrast:** Pure black and white theme with high-contrast text rendering.
- **E-ink Optimized:** Minimal animations and debounced rendering to prevent ghosting.
- **Secure:** Built-in Basic Authentication for both web and WebSocket connections.
- **Responsive:** Designed for mobile portrait displays (6.8" e-readers).
- **Audio Notifications:** Smart idle detection that "beeps" when a CLI prompt is waiting.

## Quick Start

You can run this directly via `npx` (once published) or by cloning the repository:

```bash
npx Nissorn/e-ink-terminal

# Install dependencies
npm install

# Build the frontend
npm run build

# Start the server
npm start
```

The server will start on `http://localhost:3000`.

## Configuration (Setting Username & Password)

By default, the dashboard is protected with:
- **Username:** `admin`
- **Password:** `admin`

You can change these by setting **Environment Variables** before starting the server:

### Mac / Linux:
```bash
export TERMINAL_USER="myusername"
export TERMINAL_PASSWORD="mypassword"
npm start
```

### Windows (Command Prompt):
```bash
set TERMINAL_USER=myusername
set TERMINAL_PASSWORD=mypassword
npm start
```

## Tmux Setup Guide (For New Users)

This dashboard is designed to attach to a **tmux** session named `ai-agent`. Tmux allows your AI agents and terminal tasks to keep running even if you close your browser or disconnect from the dashboard.

### 1. Create the AI Session
Before starting the dashboard, open a terminal on your Mac and run:
```bash
tmux new -s ai-agent
```
*If you already have a session running, the dashboard will attach to it automatically.*

### 2. Setting up Windows (W0 to W4)
The dashboard has a **Tab Bar** at the top (`W0` through `W4`). To make these work, you need to create windows inside your tmux session.

While inside your `ai-agent` tmux session on your Mac:
- **Create a new window:** Press `Ctrl+b` then `c`.
- **Create up to 5 windows:** Repeat the create command until you have 5 windows (indexed 0 to 4).
- **Run different tasks:** You can now run Claude Code in `W0`, GitHub Copilot in `W1`, and a system monitor in `W2`.

### 3. Using the Dashboard Tabs
Once your windows are created, you can use the `[ W0 ]` through `[ W4 ]` buttons on your E-reader to switch between them instantly. The dashboard handles the complex tmux shortcuts for you!

### 4. Useful Tmux Shortcuts (On your Mac)
- `Ctrl+b` then `d`: **Detach** (Leave the session running in the background and return to your normal terminal).
- `tmux ls`: List all running sessions.
- `tmux attach -t ai-agent`: Re-attach to the AI session from your Mac terminal.

## Deployment

Since this is a single-server architecture, you can easily expose it to the internet using tools like `cloudflared` or `ngrok` to access your Mac's terminal remotely from your E-reader.

```bash
# Example using Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

## License

MIT
