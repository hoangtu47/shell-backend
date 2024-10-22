const express = require('express')
const http = require('http')
const WebSocket = require('ws')

var pty = require('node-pty');
const { code } = require('process');

// Capture SIGINT signal
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing gracefully');
    
    // Exit the process
    process.exit(0);
})

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server})

console.log("Socket is up and running...")

wss.on('connection', ws => {
    console.log("new session")
    
    // invoke a shell once a new session is created
    const shell = pty.spawn('/bin/sh', [], {
        name: 'xterm',
        cwd: process.env.HOME,
        env: process.env,
        cols: 100,
        rows: 100,
    })

    // Catch incoming command typed
    ws.on('message', (event) => {
        try {
            const data = JSON.parse(event);
        
            if (typeof data === 'object' && data !== null) {
                shell.resize(data['cols'], data['rows']);
            } else {
                shell.write(event);
            }
          } catch (error) {
            shell.write(event);
          }
        
    })

    // handle WebSocket close event
    ws.on('close', () => {
        console.log("Killed the process!")
        shell.clear()
        shell.kill()
    })

    // Output: Sent to the frontend every change
    shell.on('data', (data) => {
        ws.send(data)
    })

    // handle the exit event
    shell.on('exit', (code) => {
        ws.close(1000, "Process exited with code ${code}")
        console.log(`Process exited with code ${code}`)
    })

})

server.listen(8080, () => {
    console.log('Server is listening on port 8080')
})