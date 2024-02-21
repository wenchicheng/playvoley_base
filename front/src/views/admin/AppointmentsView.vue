<template>
  <v-container>
    <v-row class="row">
      <v-col cols="12">
        <h1 class="text-center mt-4">開放時段管理</h1>
      </v-col>
      <v-col cols="12">
        <v-data-table-server
          v-model:items-per-page="tableItemsPerPage"
          v-model:sort-by="tableSortBy"
          v-model:page="tablePage"
          :items="tableProducts"
          :headers="tableHeaders"
          :loading="tableLoading"
          :items-length="tableItemsLength"
          :search="tableSearch"
          @update:items-per-page="tableLoadItems"
          @update:sort-by="tableLoadItems"
          @update:page="tableLoadItems"
          hover
        >
          <template v-slot:top>
            <v-row>
              <v-col cols="3" xl="2" md="2" sm="4">
              <v-btn
              prepend-icon="mdi-plus"
              color="#1565C0"
              height="40"
              rounded="xl"
              block
              class="mt-3"
              @click="addAppointDialog()">新增時段</v-btn>

              </v-col>
              <v-col cols="9" xl="10" md="10" sm="8">
                <v-text-field
                label="搜尋"
                append-icon="mdi-magnify"
                v-model="tableSearch"
                variant="underlined"
                @click:append="tableApplySearch"
                @keydown.enter="tableApplySearch"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <!-- 欄位顯示方式 item.後面接key值-->
          <template #[`item.online`]="{ item }">
            <v-icon v-if="item.online">mdi-check</v-icon>
          </template>
          <template #[`item.edit`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" color="#1565C0" @click="addAppointDialog(item)"></v-btn>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent width="600px">
      <v-form :disabled="isSubmitting" @submit.prevent="submit">
        <v-card>
          <v-card-title>{{ dialogId === '' ? '新增時段場次' : '編輯時段場次' }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-select
                  label="場地"
                  :items="courts"
                  v-model="court.value.value"
                  :error-messages="court.errorMessage.value"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                label="開放名額"
                type="number" min="0"
                v-model="peoplenumber.value.value"
                :error-messages="peoplenumber.errorMessage.value"
              ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                label="網高"
                :items="heights"
                v-model="height.value.value"
                :error-messages="height.errorMessage.value"
              ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  label="說明"
                  :items="infoItems"
                  v-model="info.value.value"
                  multiple
                  chips
                  :error-messages="info.errorMessage.value"
                ></v-select>
              </v-col>
              <v-checkbox
                label="上線"
                v-model="online.value.value"
                :error-messages="online.errorMessage.value"
                class="ml-2"
              ></v-checkbox>

            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" :disabled="isSubmitting" @click="closeDialog">取消</v-btn>
            <v-btn color="green" type="submit" :loading="isSubmitting">送出</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
// yup 驗證表單 vee-validate 驗證套件
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'

const { apiAuth } = useApi()
const createSnackbar = useSnackbar()

const infoItems = ['新手友善', '男女混打', '僅限女生', '僅限男生', '宵夜場', '早場', '一般場', '高手場', '未開放', '只開放季打', '徵臨打']

// const fileAgent = ref(null)
// 給元件一個ref="fileAgent" 取得 vue-file-agent 的實例元件，
// 再建立同名的 ref(null)，就可使用元件的ref的fileAgent.value，
// 並呼叫裡面的function "deleteFileRecord()"

const dialog = ref(false)
// 表單對話框正在編輯的 ID，空的話代表是新增
const dialogId = ref('')

// 點擊"新增"的時候，打開編輯對話框，並自動帶入資訊
const addAppointDialog = (item) => {
  if (item) {
    dialogId.value = item._id
    court.value.value = item.court
    peoplenumber.value.value = item.peoplenumber
    info.value.value = item.info
    height.value.value = item.height
    online.value.value = item.online
  } else {
    dialogId.value = ''
  }
  dialog.value = true
}
// 關閉對話框---------------------------------------------------------------
const closeDialog = () => {
  dialog.value = false
  resetForm()
  // fileAgent.value.deleteFileRecord()
  // deleteFileRecord() 刪除檔案
}

// 分類---------------------------------------------------------------------
const heights = ['女網', '男網']
const courts = ['A', '未開放']

// 表單驗證-----------------------------------------------------------------
const schema = yup.object({
  court: yup
    .string()
    .required('場地，必填'),
  // .test('isCourt', '場地類別錯誤', value => courts.includes(value)),
  peoplenumber: yup
    .number()
    .typeError('開放名額格式錯誤')
    .required('缺少開放名額')
    .min(0, '開放名額不能小於0'),
  info: yup
    .array()
    .of(yup.string().required('此欄位為必填'))
    .required('此欄位為必填'),
  height: yup
    .string()
    .required('缺少網高')
    .test('isHeight', '網高分類錯誤', value => heights.includes(value)),
  // .test(自訂驗證名稱,錯誤訊息,驗證函式)
  online: yup
    .boolean()
})
// handleSubmit 送出表單  發請求 isSubmitting 判斷是否正在送出  resetForm 重置表單每次打開都是新的值
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  // 設定初始值
  initialValues: {
    court: 'A',
    peoplenumber: 15,
    // info: [],
    height: '',
    online: true
  }
})

// 表單欄位的 useField
const court = useField('court')
const peoplenumber = useField('peoplenumber')
const info = useField('info')
const height = useField('height')
const online = useField('online')

// const fileRecords = ref([])

// 提交資料時
const submit = handleSubmit(async (values) => {
  // if (dialogId.value === '') return
  try {
    // 建立 FormData 物件
    // 使用 fd.append(欄位, 值) 將資料放進去------------------------------------

    // 送出表單--------------------------------------------------------------
    if (dialogId.value === '') {
      await apiAuth.post('/appointments', {
        court: values.court,
        peoplenumber: values.peoplenumber,
        info: values.info,
        height: values.height,
        online: values.online
      })
    } else {
      await apiAuth.patch('/appointments/' + dialogId.value, {
        court: values.court,
        peoplenumber: values.peoplenumber,
        info: values.info,
        height: values.height,
        online: values.online
      })
    }
    // 顯示成功訊息-----------------------------------------------------------
    createSnackbar({
      text: dialogId.value === '' ? '新增成功' : '編輯成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'green',
        location: 'bottom'
      }
    })
    // 表格更新並回到第一頁
    closeDialog()
    tableApplySearch()
  } catch (error) {
    console.log(error)
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
  }
})

// 表格    每頁10個-------------------------------------------------------
const tableItemsPerPage = ref(10)
// 表格排序，desc 降冪，asc 升冪
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
// 表格頁碼
const tablePage = ref(1)
// 表格資料陣列
const tableProducts = ref([])
// 表格欄位設定
const tableHeaders = [
  // { title: '日期', align: 'center', sortable: true, key: 'date' },
  // { title: '時段', align: 'center', sortable: true, key: 'time' },
  { title: '名額', align: 'center', sortable: true, key: 'peoplenumber' },
  { title: '網高', align: 'center', sortable: true, key: 'height' },
  // { title: '說明', align: 'center', sortable: true, key: 'info' },
  { title: '上線', align: 'center', sortable: true, key: 'online' },
  { title: '場地', align: 'center', sortable: false, key: 'court' },
  { title: '編輯', align: 'center', sortable: false, key: 'edit' }
]
// 表格載入狀態
const tableLoading = ref(true)
// 表格全部資料數
const tableItemsLength = ref(0)
// 表格搜尋文字
const tableSearch = ref('')
// 表格載入資料
const tableLoadItems = async () => {
  // 載入中
  tableLoading.value = true
  try {
    const { data } = await apiAuth.get('/appointments/all', {
      params: {
        page: tablePage.value,
        itemsPerPage: tableItemsPerPage.value,
        sortBy: tableSortBy.value[0]?.key || 'createdAt',
        sortOrder: tableSortBy.value[0]?.order === 'asc' ? 1 : -1,
        search: tableSearch.value
      }
    })
    tableProducts.value.splice(0, tableProducts.value.length, ...data.result.data)
    tableItemsLength.value = data.result.total
  } catch (error) {
    console.log(error)
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
  }
  // 載入完畢
  tableLoading.value = false
}
tableLoadItems()
// 表格套用搜尋------------------------------------------------
const tableApplySearch = () => {
  tablePage.value = 1
  tableLoadItems()
}
</script>

<style scoped>

.row{
  width: 80%;
  margin: 0 auto;
}
.v-data-table__thead {
  font-weight: bold;
}
.v-data-table {
    background-color: rgb(224, 236, 246);
    font-weight: bold;
}
</style>
