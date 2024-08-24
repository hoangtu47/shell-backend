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

    // Catch incoming request
    ws.on('message', command => {
        var processedCommand = commandProcessor(command)
        ptyProcess.write(processedCommand);
    })

    // Output: Sent to the frontend
    ptyProcess.on('data', function (rawOutput) {
        var processedOutput = outputProcessor(rawOutput);
        ws.send(processedOutput);
        console.log(processedOutput);

    });
})

const commandProcessor = function(command) {
    return command;
}

const outputProcessor = function(output) {
    return output;
}

server.listen(8080, () => {
    console.log('Server is listening on port 8080')
})