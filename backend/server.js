const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
app.use(cors());

const validUser = process.env.TERMINAL_USER || 'admin';
const validPass = process.env.TERMINAL_PASSWORD || 'admin';

// Protect all HTTP routes with basic auth
app.use(basicAuth({
  users: { [validUser]: validPass },
  challenge: true,
  realm: 'E-ink Terminal'
}));

// Serve static frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 3000;
const TMUX_SESSION = 'ai-agent';

let ptyProcess = null;

// Initialize PTY
function initPty() {
  if (ptyProcess) {
    return;
  }

  try {
    // Attempt to attach to existing tmux session
    ptyProcess = pty.spawn('tmux', ['attach-session', '-t', TMUX_SESSION], {
      name: 'screen-256color',
      cols: 80,
      rows: 24,
      cwd: process.env.HOME,
      env: Object.assign({}, process.env, { LANG: 'en_US.UTF-8', TERM: 'screen-256color' })
    });

    console.log(`Attached to tmux session: ${TMUX_SESSION}`);
    io.emit('terminal-status', `Attached to tmux session: ${TMUX_SESSION}`);

  } catch (error) {
    console.log(`Failed to start tmux (${error.message}). Falling back to regular shell.`);
    io.emit('terminal-status', `Tmux not found. Spawning a new regular shell instead.`);
    
    // Fallback to spawning a new regular shell (zsh on mac)
    const shell = process.env.SHELL || '/bin/zsh';
    try {
      ptyProcess = pty.spawn(shell, [], {
        name: 'screen-256color',
        cols: 80,
        rows: 24,
        cwd: process.env.HOME,
        env: Object.assign({}, process.env, { LANG: 'en_US.UTF-8', TERM: 'screen-256color' })
      });
      console.log(`Spawned fresh shell: ${shell}`);
    } catch (fallbackError) {
      console.error('Failed to start fallback shell:', fallbackError);
      io.emit('terminal-status', `Critical Error: Cannot start any terminal. ${fallbackError.message}`);
      return;
    }
  }

  ptyProcess.onData((data) => {
    io.emit('terminal-data', data);
  });

  ptyProcess.onExit((e) => {
    console.log('PTY process exited', e);
    ptyProcess = null;
    io.emit('terminal-status', 'Terminal process exited. Refresh to reconnect.');
  });
}

io.use((socket, next) => {
    const authHeader = socket.request.headers.authorization;
    if (!authHeader) return next(new Error('Authentication error: Missing basic auth header'));

    const b64auth = (authHeader || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    if (login === validUser && password === validPass) {
        return next();
    }
    return next(new Error('Authentication error: Invalid credentials'));
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  if (!ptyProcess) {
    socket.emit('terminal-status', `Connecting to tmux session '${TMUX_SESSION}'...`);
    initPty();
    if (!ptyProcess) {
        socket.emit('terminal-status', `Failed to find or attach to tmux session '${TMUX_SESSION}'.`);
    }
  } else {
    socket.emit('terminal-status', `Connected to existing tmux session '${TMUX_SESSION}'.`);
  }

  socket.on('terminal-input', (input) => {
    if (ptyProcess) {
      ptyProcess.write(input);
    } else {
      socket.emit('terminal-status', 'Cannot send input: Terminal is not connected.');
    }
  });

  socket.on('terminal.resize', ({ cols, rows }) => {
    if (ptyProcess && cols && rows) {
      try {
        const c = Math.floor(cols);
        const r = Math.floor(rows);
        if (c > 0 && r > 0) {
          ptyProcess.resize(c, r);
        }
      } catch (e) {
        console.error('Failed to resize pty', e);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`E-ink Terminal Server running on http://localhost:${PORT}`);
  console.log(`🔒 Authentication Required!`);
  console.log(`Username: ${validUser}`);
  console.log(`Password: ${validPass}`);
  console.log('-------------------------------------------');
  initPty();
});
