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

### Windows (PowerShell):
```powershell
$env:TERMINAL_USER="myusername"
$env:TERMINAL_PASSWORD="mypassword"
npm start
```

## Deployment

Since this is a single-server architecture, you can easily expose it to the internet using tools like `cloudflared` or `ngrok` to access your Mac's terminal remotely from your E-reader.

```bash
# Example using Cloudflare Tunnel
cloudflared tunnel --url http://localhost:3000
```

## License

MIT
