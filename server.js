const express = require('express')
const dotenv = require('dotenv')
dotenv.config({path : './config/config.env'})
const errorHandler = require('./Middleware/error')
const logger = require('./Middleware/logger')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cookieParser = require('cookie-parser')
const fileUpload= require('express-fileupload')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

// Router file
const bootcamps = require('./Routes/Bootcamps')
const course = require('./Routes/course')
const auth = require('./Routes/auth')
const users = require('./Routes/user')
const reviews = require('./Routes/reviews')

connectDB()
const app = express()


//body parsee because api format is in json
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(sanitize())
app.use(xss())
app.use(rateLimit())

// app.use(logger)
// Mount router

app.use(errorHandler)
//Dev logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan())
}

//file uploader
app.use(fileUpload())

app.use('/api/v1/bootcamps' , bootcamps)
app.use('/api/v1/auth' , auth)
app.use('/api/v1/course',course)
app.use('/api/v1/users' , users)
app.use('/api/v1/reviews' , reviews)



// Define Port
const PORT = process.env.PORT || 6000 
const server = app.listen(PORT, () => {
    console.log(`Server is running ${process.env.NODE_ENV} mode on ${PORT}`.bgBlue.green)
})

// handle unhandle promise rejection
process.on('unhandledRejection',(err, promise) =>{
    console.log(`Error : ${err.message}`.bgRed.green)

    //close server & exit process
    server.close(() => process.exit(1))
})

