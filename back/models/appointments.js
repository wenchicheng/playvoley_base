import { Schema, model } from 'mongoose'
const schema = new Schema({
  court: {
    type: String,
    required: [true, '場地，必填'],
    enum: {
      values: ['排球場A', '未開放']
    },
    default: '排球場A'
  },
  // date: {
  //   type: Date,
  //   required: [true, '日期，必填']
  // },
  // time: {
  //   type: String,
  //   required: [true, '時段，必填'],
  //   enum: {
  //     values: ['', ''],
  //     message: '請選擇時段'
  //   }
  // },
  // member: {
  //   type: String,
  //   required: [true, '開放人數，必填']
  // },
  peoplenumber: {
    type: Number,
    required: [true, '開放名額，必填'],
    min: [0, '開放名額不能小於0']
  },
  height: {
    type: String,
    required: [true, '女網/男網，必填'],
    enum: {
      values: ['女網', '男網'],
      message: '請選擇女網/男網'
    }
  },
  // info: {
  //   type: String,
  //   required: [false, '說明，必填'],
  //   enum: {
  //     values: ['新手友善', '限制男女比例', '僅限女生', '僅限男生'],
  //     message: '請選擇說明敘述'
  //   }
  // },
  online: {
    type: Boolean,
    required: [true, '是否開放報名，必填'],
    default: true
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('appointments', schema)
