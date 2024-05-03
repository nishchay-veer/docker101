const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config')
const port = process.env.PORT || 3000

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`).then(()=>{
        console.log('Connected to MongoDB')
    }).catch((err)=>{
        console.log('Error: ', err)
        console.log('Retrying in 5 seconds')
        setTimeout(connectWithRetry, 5000)
    })
}

connectWithRetry()

app.get('/', (req, res) => {
  res.send('<h2> Hii ere! </h2>')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })