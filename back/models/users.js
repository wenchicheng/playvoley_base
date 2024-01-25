import { Schema, model, ObjectId } from 'mongoose'
import { Validator } from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const cartSchema = new Schema({
  product: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品欄位']
  },
  quantity: {
    type: Number,
    required: [true, '缺少商品數量']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '使用者帳號必填'],
    minlength: [4, '使用者帳號最少4個字'],
    maxlength: [12, '使用者帳號最多12個字'],
    unique: true,
    // unique: true 在整個集合中必須是唯一的
    validate: {
      // 限制帳號是不是只有英文和數字，可用正規表示法或 validator 套件的 isAlphanumeric 做驗證
      validator (value) {
        return Validator.isAlphanumeric(value)
      },
      message: '使用者帳號只能是英文和數字'
    }
  },
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    unique: true,
    validate: {
      validator (value) {
        return Validator.isEmail(value)
      },
      message: '信箱格式不正確'
    }
  },
  password: {
    type: String,
    required: [true, '使用者密碼必填']
    // minlength: [6, '使用者密碼最少6個字'],
    // maxlength: [12, '使用者密碼最多12個字']
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [cartSchema],
    default: []
  },
  role: {
    type: String,
    // 在 back/enums/UserRole.js 裡面另外定義 0 使用者 1 管理員
    default: UserRole.USER
  },
  timestamps: true,
  versionKey: false
})

export default model('users', schema)
