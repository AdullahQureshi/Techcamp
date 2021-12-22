const express = require('express')
const dotenv = require('dotenv')

dotenv.config({path : './config/config.env'})

const app = express()

// Define Port
const PORT = process.env.PORT || 6000
app.listen(PORT, () => {
    console.log(`Server is running ${process.env.NODE_ENV} mode on ${PORT}`)
})
