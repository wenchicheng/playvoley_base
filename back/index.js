import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routeUsers from './routes/users.js'
import { StatusCodes } from 'http-status-codes'
import './passport/passport.js'

const app = express()

// CORS 跨域請求(指瀏覽器，非後端，後端不會有跨域問題，postman 會顯示 undefined)
app.use(cors({
  // origin = 請求的來源
  // callback (錯誤,是否允許請求)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github.io') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))

// 401 因為不知道，可能沒驗證是誰所以拒絕請求
// 403 知道是誰，可能是因為沒有權限所以拒絕請求
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒絕'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use('/users', routeUsers)

app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})
// app.all => 任意請求方式  ， '*' => 任意路徑
// app.all('*',(req, res) =>  任意請求的任意路徑(沒有寫的路徑)執行 function 回應404找不到

app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
