const express = require('express')
const {connectToDB} = require('./config/connectToDB')
const dotenv = require('dotenv')
dotenv.config() // allow app to read data from ".env" file


// Routes
const authRoute = require('./route/auth.route')
const userRoute = require('./route/user.route')
const postRoute = require('./route/post.route')
const commentRoute = require('./route/comment.route')
const categRoute = require('./route/categorey.route')


const { errorHandler } = require('./MiddleWares/errorHandler')
const { notFound } = require('./MiddleWares/routeNotFound')

// Init App
const app = express()

// connsct to db
connectToDB();

// MiddleWares
app.use(express.json()) // to be able to read data sent form client


// routes
app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)
app.use('/api/comment', commentRoute)
app.use('/api/categorey', categRoute)

app.use(notFound)
// Error Handler
app.use(errorHandler)

// Run the server
const port = process.env.PORT||5000 
app.listen(port, () =>
    console.log(`Server is Running in ${process.env.NODE_ENV} mode on port ${port}`)
)