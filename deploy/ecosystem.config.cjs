// Set GC_PORT only after checking it is free on the actual VPS.
const port = Number(process.env.GC_PORT)
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Set GC_PORT to a verified free port (1024-65535)')
module.exports = {
  apps: [{
    name: 'stmarys-guwahati-club',
    cwd: process.env.GC_CWD || '/srv/stmarys-guwahati-club/current',
    script: './scripts/start.mjs',
    args: ['--hostname', '127.0.0.1', '--port', String(port)],
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production' },
    autorestart: true,
    restart_delay: 3000,
    min_uptime: '10s',
    max_restarts: 10,
    kill_timeout: 10000,
    time: true,
    merge_logs: true,
    max_memory_restart: '768M',
  }],
}
