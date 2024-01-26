import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

// 建立使用者帳號 - 註冊
export const create = async (req, res) => {
  try {
    await users.create(req.body)
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '帳號已註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 登入
export const login = async (req, res) => {
  // 這裡的 req.user 是從 passport.js 裡面的 done(null, user, null) 傳過來的
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // 第一個參數: { _id: req.user._id } => 放序號要保存的id
    // 第二個參數: process.env.JWT_SECRET => 放密鑰
    // { expiresIn: '7 days' } => 有效期限
    req.user.tokens.push(token)
    // 將 token 放進 user.tokens 陣列裡面
    await req.user.save()
    // 將 user 存進資料庫
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        cart: req.user.cart.reduce((total, current) => {
          return total + current.quantity
        }, 0)
        // 設定初始值為 0
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
