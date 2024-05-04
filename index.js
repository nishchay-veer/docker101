const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config')
const port = process.env.PORT || 3000
const session = require('express-session')
const redis = require('redis')
const RedisStore = require("connect-redis").default
let redisClient = redis.createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`
})

redisClient.connect().catch(console.error);

const postRouter = require('./routes/postRoutes')
const userRouter = require('./routes/userRoutes')
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

const redisStore = new RedisStore({
    client: redisClient,
});

app.use(
   session({
     store: redisStore,
     secret: "SESSION_SECRET",
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: false,
    },
  })
);

app.use(express.json())
app.get('/', (req, res) => {
  res.send('<h2> Hii ere! </h2>')
})

app.use('/api/v1/posts', postRouter)
app.use('/api/v1/users', userRouter)
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })