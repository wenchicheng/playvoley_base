import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

passport.use('login', new passportLocal.Strategy({
  // 使用local的驗證方式，passportLocal的驗證策略
  usernameField: 'account',
  // 我們傳進來的資料裡面，帳號的欄位名稱是 account
  passwordField: 'password'
  // 我們傳進來的資料裡面，密碼的欄位名稱是 password
}, async (account, password, done) => {
  try {
    const user = await users.findOne({ account })
    // 尋找帳號
    if (!user) {
      throw new Error('ACCOUNT_NOT_EXIST')
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('PASSWORD_INCORRECT')
    }
    return done(null, user, null)
  } catch (error) {
    if (error.message === 'ACCOUNT_NOT_EXIST') {
      return done(null, null, { message: '帳號不存在' })
    } else if (error.message === 'PASSWORD_INCORRECT') {
      return done(null, null, { message: '密碼錯誤' })
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
