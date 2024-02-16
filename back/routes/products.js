import { Router } from 'express'
import * as auth from '../middlewares/auth.js'
import { create, getAll } from '../controllers/products.js'
import upload from '../middlewares/upload.js'
import admin from '../middlewares/admin.js'

const router = Router()

router.post('/', auth.jwt, admin, upload, create)
// 驗證有沒有登入jwt > 管理員驗證判斷權限 > 上傳圖片 > 創建商品塞進資料庫
router.get('/all', auth.jwt, admin, getAll)
// 驗證有沒有登入jwt > 管理員驗證判斷權限 > 查詢所有商品

export default router
