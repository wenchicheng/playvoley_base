import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { createAppointment } from '../controllers/appointments.js'
import admin from '../middlewares/admin.js'

const router = Router()

router.post('/', auth.jwt, admin, createAppointment)
// 驗證有沒有登入jwt > 管理員驗證判斷權限 > 創建預約時間塞進資料庫

export default router
