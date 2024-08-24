const express = require('express')
const http = require('http')
const WebSocket = require('ws')

var os = require('os');
var pty = require('node-pty');

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server})

console.log("Socket is up and running...")

// invoke a shell
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    env: process.env,
});

wss.on('connection', ws => {
    console.log("new session")

    // Catch incoming character typed and pass to shell word by word
    ws.on('message', command => {
        ptyProcess.write(command);
    })

    // Output: Sent to the frontend
    ptyProcess.on('data', function (rawOutput) {
        ws.send(rawOutput)
    });
})

server.listen(8080, () => {
    console.log('Server is listening on port 8080')
})