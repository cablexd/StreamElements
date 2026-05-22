import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import { setupSocket } from './websocket.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT ?? 3000

const app = express()
app.use(express.static(join(__dirname, 'public')))

const server = createServer(app)
const io = new Server(server)

setupSocket(io)

server.listen(port, () => {
    console.info(`Server: http://localhost:${port}`)
})