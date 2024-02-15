import { Schema, model } from 'mongoose'
const schema = new Schema({
  court: {
    type: String,
    required: [true, '場地，必填']
  },
  date: {
    type: Date,
    required: [true, '開放預約日期，必填']
  },
  time: {
    type: String,
    required: [true, '開放預約時段，必填']
  },
  menber: {
    type: String,
    required: [true, '開放人數，必填']
  },
  height: {
    type: String,
    required: [true, '女網/男網，必填'],
    enum: {
      values: ['女網', '男網'],
      message: '請選擇女網/男網'
    }
  },
  info: {
    type: String,
    required: [false, '說明，必填']
  },
  online: {
    type: Boolean,
    required: [true, '是否開放線上報名，必填']
    // default: false
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('appointments', schema)
