import passport from 'passport'
import { StatusCodes } from 'http-status-codes'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (!user || error) {
      // 如果 不是user 或 error 不是 null，則認證失敗
      if (info.message === 'Missing credentials') {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: '欄位錯誤'
        })
        return
      } else if (info.message === '未知錯誤') {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: '未知錯誤'
        })
        return
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: info.message
        })
        return
      }
    }
    req.user = user
    // 如果認證成功，則將用戶物件附加到請求物件上
    next()
    // next() 調用下一個中介軟體
  })(req, res, next)
  // 認證函數的立即調用，它將請求物件、回應物件和下一個中介軟體函數作為參數
}
