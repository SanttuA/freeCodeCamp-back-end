import http from 'http';
import fs from 'fs';
import WebSocket, { WebSocketServer } from 'ws';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const filePath = join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading file\n');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
        });
    }
    else if(req.url === "/script.js"){
        const filePath = join(__dirname, 'public', 'script.js');
        fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading file\n');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found\n');
  }
})

const wss = new WebSocketServer({server})

wss.on("connection", (socket, req) => {
    const username = new URL(req.url, "http://localhost").searchParams.get("username")

    wss.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN){
            const msg = JSON.stringify({"type": "system", "text": `${username} joined`})
            client.send(msg)
        }
    });

    socket.on("message", (data) => {
        const {username, text} = JSON.parse(data)
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                const msg = JSON.stringify({"type": "chat", username, text})
                client.send(msg)
            }
        })
    })

    socket.on("close", () => {
        wss.clients.forEach(client => {
            if(client.readyState === WebSocket.OPEN){
                const msg = JSON.stringify({type: "system", text: `${username} left`})
                client.send(msg)
            }

        })
    })

    socket.on("error", (err) => {
        console.log(err)
    })
})

server.listen(PORT, () => {
    console.log(`Chat server running at http://localhost:${PORT}`)
})
