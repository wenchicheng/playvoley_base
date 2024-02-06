<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>登入</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-form :disabled="isSubmitting" @submit.prevent="submit">
          <!--  @submit.prevent="submit" 送出時停止跳頁的預設動作，執行自訂的submit -->
          <!-- <v-text-field
            label="帳號"
            minlength="4"
            maxlength="20"
            counter
            v-model="account.value.value"
            :error-messages="account.errorMessage.value"
          /> -->
          <v-text-field
            label="信箱"
            type="email"
            v-model="email.value.value"
            :error-messages="email.errorMessage.value"
          />
          <v-text-field
            label="密碼"
            type="password"
            minlength="4"
            maxlength="12"
            counter
            v-model="password.value.value"
            :error-messages="password.errorMessage.value"
          />

          <v-btn type="submit" color="green" @click="dialog = false" class="w-100">登入</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import validator from 'validator'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import { useApi } from '@/composables/axios'
import { useUserStore } from '@/store/user'

const { api } = useApi()

const router = useRouter()
const createSnackbar = useSnackbar()

const userStore = useUserStore()

// 定義註冊表單的資料格式
const schema = yup.object({
  // account: yup
  //   .string()
  //   .required('帳號為必填欄位')
  //   .min(4, '使用者帳號長度不符')
  //   .max(20, '使用者帳號長度不符'),
  email: yup
    .string()
    .required('信箱為必填欄位')
    // .test(自訂驗證名稱, 錯誤訊息, 驗證function)
    .test(
      'isEmail', '信箱格式錯誤',
      (value) => {
        return validator.isEmail(value)
      }
    ),
  password: yup
    .string()
    .required('密碼為必填欄位')
    .min(4, '密碼長度不符')
    .max(12, '密碼長度不符')
})

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema
})

// const account = useField('account')
const email = useField('email')
const password = useField('password')
// const passwordConfirm = useField('passwordConfirm')

const submit = handleSubmit(async (values) => {
  console.log(values)
  try {
    const { data } = await api.post('/users/login', {
      // account: values.account,
      email: values.email,
      password: values.password
    })
    userStore.login(data.result)
    createSnackbar({
      text: '登入成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    router.push('/')
    // 回到首頁
  } catch (error) {
    // console.log('到底是什麼錯誤1', error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
    // console.log('到底是什麼錯誤2', error)
  }
})
</script>
