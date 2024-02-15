import appointments from '../models/appointments.js'
import { StatusCodes } from 'http-status-codes'
import validator from 'validator'

export const createAppointment = async (req, res) => {
  try {
    // 取得從前端送來的預約時間資料
    const appointmentData = req.body

    // 在這裡可能需要進行資料驗證，確保預約時間資料的有效性

    // 將預約時間資料存入資料庫中
    const result = await appointments.create(appointmentData)

    // 回傳成功訊息給前端
    res.status(StatusCodes.OK).json({
      success: true,
      message: '預約時間成功',
      result
    })
  } catch (error) {
    // 如果發生錯誤，則回傳錯誤訊息給前端
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '預約時間失敗'
    })
  }
}

// 查詢======================================
export const getAllAppointments = async (req, res) => {
  try {
    // 在這裡獲取所有預約時間資料並回傳給前端

    const allAppointments = await appointments.find()

    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: allAppointments
    })
  } catch (error) {
    console.error(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '獲取預約時間失敗'
    })
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id

    // 檢查預約時間ID是否有效
    if (!validator.isMongoId(appointmentId)) {
      throw new Error('Invalid appointment ID')
    }

    // 查找預約時間
    const appointment = await appointments.findById(appointmentId)

    // 如果找不到預約時間，則回傳錯誤訊息
    if (!appointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到該預約時間'
      })
    }

    // 回傳找到的預約時間
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: appointment
    })
  } catch (error) {
    // 處理錯誤
    console.error(error)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '獲取預約時間失敗'
    })
  }
}
// 修改======================================
export const editAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id
    const appointmentData = req.body

    // 檢查預約時間ID是否有效
    if (!validator.isMongoId(appointmentId)) {
      throw new Error('Invalid appointment ID')
    }

    // 更新預約時間資料
    const updatedAppointment = await appointments.findByIdAndUpdate(appointmentId, appointmentData, { new: true })

    // 如果找不到預約時間，則回傳錯誤訊息
    if (!updatedAppointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到該預約時間'
      })
    }

    // 回傳更新後的預約時間資料
    res.status(StatusCodes.OK).json({
      success: true,
      message: '預約時間更新成功',
      result: updatedAppointment
    })
  } catch (error) {
    // 處理錯誤
    console.error(error)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '編輯預約時間失敗'
    })
  }
}

// 刪除======================================
export const deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id

    // 檢查預約時間ID是否有效
    if (!validator.isMongoId(appointmentId)) {
      throw new Error('Invalid appointment ID')
    }

    // 刪除預約時間
    const deletedAppointment = await appointments.findByIdAndDelete(appointmentId)

    // 如果找不到預約時間，則回傳錯誤訊息
    if (!deletedAppointment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: '找不到該預約時間'
      })
    }

    // 回傳成功訊息
    res.status(StatusCodes.OK).json({
      success: true,
      message: '預約時間刪除成功'
    })
  } catch (error) {
    // 處理錯誤
    console.error(error)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: '刪除預約時間失敗'
    })
  }
}
