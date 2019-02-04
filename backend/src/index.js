const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')

require('dotenv').config({
    path: '.env'
})
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

server.express.use(cookieParser())
server.express.use((req, res, next) => {
    const { token } = req.cookies

    if (token) {
        const { userId } = jwt.verify(token, process.env.APP_SECRET)
        req.userId = userId
    }
    next()
})
//TODO use express middleware to populate current user

server.start({
    cors: {
        credentials: true,
        origin: process.env.FRONTEND_URL
    },
}, details => {
    console.log(`Server is now running on http://localhost:${details.port}`)
})
