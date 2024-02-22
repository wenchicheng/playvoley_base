<template>
  <v-container>
    <v-row class="row">
      <v-col cols="12">
        <h1 class="text-center mt-4">商品管理</h1>
      </v-col>
      <v-col cols="12">
        <!-- 表格
        tableItemsPerPage 每頁顯示的項目數量
        tablePage 頁碼
        tableProducts 商品資料陣列
        tableHeaders 表頭
        tableLoading 是否載入狀態
        tableItemsLength 全部資料數
        tableSearch 搜尋字串
        tableLoadItems 載入資料
      -->
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
              @click="openDialog()">新增商品</v-btn>
              <!-- 點擊"新增商品"的時候，執行 openDialog -->
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
          <template #[`item.image`]="{ item }">
            <v-img :src="item.image" height="60px"></v-img>
          </template>
          <template #[`item.sell`]="{ item }">
            <v-icon v-if="item.sell">mdi-check</v-icon>
          </template>
          <template #[`item.edit`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" color="#1565C0" @click="openDialog(item)"></v-btn>
          </template>
        </v-data-table-server>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent width="600px">
      <v-form :disabled="isSubmitting" @submit.prevent="submit">
        <v-card>
          <v-card-title>{{ dialogId === '' ? '新增商品' : '編輯商品' }}</v-card-title>
          <v-card-text>
            <v-text-field
              label="名稱"
              v-model="name.value.value"
              :error-messages="name.errorMessage.value"
            ></v-text-field>
            <v-text-field
              label="價格"
              type="number"
              min="0"
              v-model="price.value.value"
              :error-messages="price.errorMessage.value"
            ></v-text-field>
            <v-select
              label="分類"
              :items="categories"
              v-model="category.value.value"
              :error-messages="category.errorMessage.value"
            ></v-select>
            <v-checkbox
              label="上架"
              v-model="sell.value.value"
              :error-messages="sell.errorMessage.value"
            ></v-checkbox>
            <v-textarea
              label="說明"
              v-model="description.value.value"
              :error-messages="description.errorMessage.value"
            ></v-textarea>
            <vue-file-agent
              v-model="fileRecords"
              v-model:rawModelValue="rawFileRecords"
              accept="image/jpeg,image/png"
              deletable
              :error-text="{type: '檔案格式不支援', size: '檔案超過 1MB 大小限制'}"
              help-text="選擇檔案或拖曳到這裡"
              :max-files="1"
              max-size="1MB"
              ref="fileAgent"
            ></vue-file-agent>
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

const fileAgent = ref(null)
// 給元件一個ref="fileAgent" 取得 vue-file-agent 的實例元件，
// 再建立同名的 ref(null)，就可使用元件的ref的fileAgent.value，
// 並呼叫裡面的function "deleteFileRecord()"

// 表單對話框的開啟狀態，預設關閉
const dialog = ref(false)
// 表單對話框正在編輯的商品 ID，空的話代表是新增商品
const dialogId = ref('')

// 點擊"新增商品"的時候，打開編輯對話框，並自動帶入資訊
const openDialog = (item) => {
  console.log('點擊"新增商品"')
  if (item) {
    dialogId.value = item._id
    name.value.value = item.name
    price.value.value = item.price
    description.value.value = item.description
    category.value.value = item.category
    sell.value.value = item.sell
  } else {
    dialogId.value = ''
  }
  dialog.value = true
}
// 關閉對話框---------------------------------------------------------------
const closeDialog = () => {
  dialog.value = false
  resetForm()
  fileAgent.value.deleteFileRecord()
  // deleteFileRecord() 刪除檔案
}

// 分類---------------------------------------------------------------------
const categories = ['排球衣', '排球褲', '排球襪', '排球鞋', '球具', '配件']

// 表單驗證-----------------------------------------------------------------
const schema = yup.object({
  name: yup
    .string()
    .required('缺少商品名稱'),
  price: yup
    .number()
    .typeError('商品價格格式錯誤')
    .required('缺少商品價格')
    .min(0, '商品價格不能小於 0'),
  description: yup
    .string()
    .required('缺少商品說明'),
  category: yup
    .string()
    .required('缺少商品分類')
    .test('isCategory', '商品分類錯誤', value => categories.includes(value)),
  // .test(自訂驗證名稱,錯誤訊息,驗證函式)
  sell: yup
    .boolean()
})
// handleSubmit 送出表單  發請求 isSubmitting 判斷是否正在送出  resetForm 重置表單每次打開都是新的值
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: schema,
  // 設定初始值
  initialValues: {
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false
  }
})

// 表單欄位的 useField
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')

const fileRecords = ref([])
const rawFileRecords = ref([])

// 提交資料時
const submit = handleSubmit(async (values) => {
  if (fileRecords.value[0]?.error) return
  // 如果是新增，而且檔案長度是0，就不送出
  if (dialogId.value === '' && fileRecords.value.length === 0) return
  try {
    // 建立 FormData 物件
    // 使用 fd.append(欄位, 值) 將資料放進去------------------------------------
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('price', values.price)
    fd.append('description', values.description)
    fd.append('category', values.category)
    fd.append('sell', values.sell)

    // 也可以用 for in：
    // for (const key in values) {
    //   fd.append(key, values[key])
    // }

    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }
    // 送出表單--------------------------------------------------------------
    if (dialogId.value === '') {
      await apiAuth.post('/products', fd)
    } else {
      await apiAuth.patch('/products/' + dialogId.value, fd)
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

// 表格    每頁10個商品-------------------------------------------------------
const tableItemsPerPage = ref(10)
// 表格排序，desc 降冪，asc 升冪
const tableSortBy = ref([
  { key: 'createdAt', order: 'desc' }
])
// 表格頁碼
const tablePage = ref(1)
// 表格商品資料陣列
const tableProducts = ref([])
// 表格欄位設定
const tableHeaders = [
  { title: '圖片', align: 'center', sortable: false, key: 'image' },
  { title: '名稱', align: 'left', sortable: true, key: 'name' },
  { title: '價格', align: 'center', sortable: true, key: 'price' },
  { title: '分類', align: 'center', sortable: true, key: 'category' },
  // { title: '說明', align: 'center', sortable: true, key: 'description' },
  { title: '上架', align: 'center', sortable: true, key: 'sell' },
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
    const { data } = await apiAuth.get('/products/all', {
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
