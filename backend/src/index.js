require('dotenv').config({
    path: '.env'
})
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

//TODO use express middleware to handle Cookies (JWT)
//TODO use express middleware to populate current user

server.start({
    cors: {
        crednetials: true,
        origin: process.env.FRONTEND_URL
    },
}, deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`)
})
