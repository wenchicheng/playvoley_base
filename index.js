import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import router from './back/routes/users.js'

const app = express()

app.use(express.json())
app.use((_, res, next) => {
  res.status(Sta)
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})

// 0103 01:38.