<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="Object.keys(dataMap.detailsForm).length !== 0">
    <van-tab title="明细">
      <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" :label-width="60"></DetailsVue>
    </van-tab>
    <van-tab title="已扫标签" v-if="dataMap.dataList.length > 0">
      <TableContent :columns="dataMap.columns" :dataSource="dataMap.dataList" @enter="search">
        <template v-slot:barcode="{ content }">
          {{ content.barcode }}
        </template>
        <template v-slot:quantity="{ content }">
          {{ content.quantity }}
        </template>
        <template v-slot:lowestPrice="{ content }">
          <span class="campaignItem-canChangeNum-style">{{ content.lowestPrice }}</span>
        </template>
        <template v-slot:highestPrice="{ content }">
          <span class="campaignItem-canChangeNum-style">{{ content.highestPrice }}</span>
        </template>
        <template v-slot:delete="{ content }">
          <span class="campaignItem-canChangeNum-style" @click.prevent="removeItem(content)">删除</span>
        </template>
      </TableContent>
    </van-tab>
  </van-tabs>
  <ActionBarVue ref="actionBarVue" :loading="dataMap.loading" :confirmText="dataMap.confirmText" @clear="handleClear"
    @confirm="handleConfirm" />
</template>

<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import TableContent from '@/components/tableContent/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import { WMSAPI } from '@/api/generalAPI'
import { ref, reactive, onMounted } from 'vue';
import { formList, detailsList } from './config'
import { showSuccessToast, showConfirmDialog } from 'vant'
import { _showFailToast } from '@/utils/message'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let barcodeInputRef: FieldInstance | null = null
const APIName = 'business'
const columns = [
  {
    title: '标签条码',
    key: 'barcode',
    slot: 'barcode',
  },
  {
    title: '数量',
    key: 'quantity',
    slot: 'quantity',
  },
  {
    title: '操作时间',
    key: 'lowestPrice',
    slot: 'lowestPrice',
  },
  // {
  //   title: '最高出价',
  //   key: 'highestPrice',
  //   slot: 'highestPrice',
  // },
  {
    title: '',
    key: 'delete',
    slot: 'delete',
  },
]
const dataList = [
  {
    changeMsg: '条码1',
    currentPrice: '200',
    lowestPrice: '2023-06-01',
    highestPrice: '2.35',
  },
  {
    changeMsg: '条码2',
    currentPrice: '150',
    lowestPrice: '2023-06-02',
    highestPrice: '3.35',
  },
  {
    changeMsg: '条码3',
    currentPrice: '180',
    lowestPrice: '2023-06-03',
    highestPrice: '2.35',
  },
]
const active = ref(0);
const form = ref(
  {
    barcode: '',
    message: ''
  })
let dataMap = reactive({
  formList,
  detailsList,
  form: {} as any,
  detailsForm: {} as any,
  columns: columns,
  dataList: [] as any,
  loading: false,
  confirmText: '确定'
})
onMounted(() => {
  initConfig()
})
function removeItem(item: any) {
  showConfirmDialog({
  title: '标题',
  message:
    '确定要删除吗？',
})
  .then(() => {
  const index = dataMap.dataList.indexOf(item)
  if (index !== -1) {
    dataMap.dataList.splice(index, 1)
  }
})
}
dataMap.formList[0].enter = getDetails
function getDetails() {
  if (form.value.barcode) {
    WMSAPI.get(APIName, { barcode: form.value.barcode }, 'materialsbarcode/GetBarcode').then((res) => {
      if (res.success == true) {
        barcodeInputRef?.focus()
        form.value.barcode = ''
        dataMap.detailsForm = res.data
        form.value.message = res.message as string
        dataMap.dataList.push({ barcode: res.data.barcode, quantity: res.data.quantity })
        let arr = dataMap.dataList
        let newArr = [] as any;
        let obj = {} as any;
        for (let i = 0; i < arr.length; i++) {
          //将arr[i].barcode作为对象属性进行判断
          if (!obj[arr[i].barcode]) {
            newArr.push(arr[i]);
            obj[arr[i].barcode] = true;
          }
        }
        dataMap.dataList = newArr
      } else {
        barcodeInputRef?.focus()
        form.value.barcode = ''
        form.value.message = res.message as string
      }
    })
  } else {
    // form.value.message = '请输入单据号'
  }
}
// 搜索
function search(value: string) {
  let data = dataMap.dataList.filter((item: any) => item.barcode == value)
  dataMap.dataList = data
}
// 清除
function handleClear() {
  form.value = {
    barcode: '',
    message: ''
  }
  dataMap.detailsForm = {}
  dataMap.dataList = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    let array: any[] = []
    dataMap.dataList.forEach((item: any) => {
      array.push(item.barcode)
    })
    let data = {
      barcodes: array
    }
    WMSAPI.post(APIName, data, 'pda/ArriveReturn').then((res) => {
      if (res && res.success) {
        form.value.message = res.message as string
        form.value = {
          barcode: '',
          message: ''
        }
        dataMap.detailsForm = {}
        dataMap.dataList = []

      }
      else { form.value.message = res.message as string}
    })
  })
}
// 初始化配置项
function initConfig() {
  dataMap.formList.forEach((item) => {
    if (item.prop === 'barcode') {
      barcodeInputRef = formComponent.value?.formInputRef[item.prop].inputRef
      barcodeInputRef?.focus()
    }
  })
}
</script>

<style scoped>
.form {
  margin-top: 12px;
}

::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
</style>
