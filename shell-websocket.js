const express = require('express')
const http = require('http')
const WebSocket = require('ws')

var pty = require('node-pty');
const { exitCode } = require('process');

// Capture SIGINT signal
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing gracefully');
    
    // Perform any cleanup here
    
    // Exit the process
    process.exit(0);
})

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server})

console.log("Socket is up and running...")

var shell = null

wss.on('connection', ws => {
    console.log("new session")
    
    // invoke a shell once a new session is created
    shell = pty.spawn('bash', [], {
        name: 'xterm-color',
        env: process.env,
    })

    // Catch incoming command typed
    ws.on('message', command => {
        shell.write(command);
    })

    // handle WebSocket close event
    ws.onclose = (event) => {
        console.log("Killed the process!")
        shell.kill()
    }

    // Output: Sent to the frontend every change
    shell.on('data', function (rawOutput) {
        ws.send(rawOutput)
    })

    // handle the exit event
    shell.on('exit', (exitCode, signal) => {
        ws.close(1000, "Process exited with code ${exitCode} and signal ${signal}")
        console.log(`Process exited with code ${exitCode} and signal ${signal}`)
    })

})

server.listen(8080, () => {
    console.log('Server is listening on port 8080')
})