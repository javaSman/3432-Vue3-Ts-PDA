<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active">
    <van-tab title="明细">
      <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" :label-width="60" />
    </van-tab>
    <van-tab title="已扫标签" v-if="dataMap.dataList.length > 0">
      <TableContent :columns="dataMap.columns" :dataSource="dataMap.dataList" @enter="search">
        <template v-slot:barcode="{ content }">
          {{ content.barcode }}
        </template>
        <template v-slot:quantity="{ content }">
          {{ content.quantity }}
        </template>
        <template v-slot:time="{ content }">
          <span class="campaignItem-canChangeNum-style">{{ content.time }}</span>
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
  <ActionBarVue
    ref="actionBarVue"
    :loading="dataMap.loading"
    :confirmText="dataMap.confirmText"
    @clear="handleClear"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import TableContent from '@/components/tableContent/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import { WMSAPI } from '@/api/generalAPI'
import { ref, reactive, onMounted } from 'vue'
import Dates from '@/utils/datetime'
import { validateBarcode } from '@/utils/validate'
import { formList, detailsList } from './config'
import { showSuccessToast, showConfirmDialog } from 'vant'
import { _showFailToast } from '@/utils/message'
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const time = new Dates(new Date()).strftime('H:m:s')
const form = ref({
  date: today,
  locationId: '',
  boxId: '',
  imBarcode: '',
  warehouseID: '',
  message: ''
})
const columns = [
  {
    title: '标签条码',
    key: 'barcode',
    slot: 'barcode'
  },
  {
    title: '数量',
    key: 'quantity',
    slot: 'quantity'
  },
  {
    title: '操作时间',
    key: 'time',
    slot: 'time'
  },
  // {
  //   title: '最高出价',
  //   key: 'highestPrice',
  //   slot: 'highestPrice',
  // },
  {
    title: '',
    key: 'delete',
    slot: 'delete'
  }
]
const dataList = [] as any
// {
//   barcode: '条码1',
//   quantity: '200',
//   lowestPrice: '2023-06-01',
//   highestPrice: '2.35',
// },
// {
//   barcode: '条码2',
//   quantity: '150',
//   lowestPrice: '2023-06-02',
//   highestPrice: '3.35',
// },
// {
//   barcode: '条码3',
//   quantity: '180',
//   lowestPrice: '2023-06-03',
//   highestPrice: '2.35',
// },
// ]
// const search = ref('')
const barcodes = ref([])
const APIName = 'business'
const active = ref(0)
let dataMap = reactive({
  formList,
  detailsList,
  form: {} as any,
  detailsForm: {} as any,
  // detailsForm: { inApplyforEBELN: '123455', inApplyforEBELP: '1',num: 0 },
  columns: columns,
  dataList: [] as any,
  loading: false,
  confirmText: '上架'
  // barcodes: [] as any
})
onMounted(() => {
  getDict()
  getDateAuthority()
})
// 获取仓库
function getDict() {
  WMSAPI.get(APIName, { IsPage: false }, 'warehouse/all').then((res) => {
    let array: any[] = []
    array = res.items as []
    array.forEach((item) => {
      item.label = item.warehouseName
      item.value = item.warehouseID
    })
    dataMap.formList[0].options = array
    dataMap.formList[0].optionsTwo = JSON.parse(JSON.stringify(array))
  })
}
// 获取日期权限
function getDateAuthority() {
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
    if (res.success) dataMap.formList[4].type = 'Calendar'
    else dataMap.formList[4].type = 'Text'
  })
}
dataMap.formList[2].enter = getLocation
// 获取货位编码
function getLocation() {
  if (form.value.locationId) {
    WMSAPI.get(APIName, { LocationID: form.value.locationId }, 'pda/GetLocationsInfo').then((res) => {
      if (res.success) {
        form.value.message = res.message as string
      } else {
        form.value.message = res.message as string
      }
    })
  } else {
    form.value.message = '请输入货位编码'
  }
}
dataMap.formList[1].enter = getBox
// 获取载具信息
function getBox() {
  if (form.value.boxId) {
    WMSAPI.get(APIName, { boxID: form.value.boxId }, 'box/GetBoxInfo').then((res) => {
      if (res) form.value.message = res.message as string
    })
  } else {
    form.value.message = '请输入载具编码'
  }
}
dataMap.formList[3].enter = getBarcode
// 获取标签条码
function getBarcode() {
  // 固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
  let Barcode = ''
  if (form.value.imBarcode.indexOf('#') !== -1) {
    Barcode = validateBarcode(form.value.imBarcode)
  } else {
    Barcode = form.value.imBarcode
  }
  WMSAPI.get(APIName, { Barcode: Barcode }, 'pda/GetPoInApplyforMaterialByBarcode').then((res) => {
    if (res.success) {
      form.value.message = res.message as string
      dataMap.detailsForm = res.data.receiptOrderDetail
      dataMap.dataList.push({ barcode: res.data.barcode, quantity: res.data.quantity as number, time: time })
      let arr = dataMap.dataList
      let newArr = [] as any
      let obj = {} as any
      for (let i = 0; i < arr.length; i++) {
        // 将arr[i].barcode作为对象属性进行判断
        if (!obj[arr[i].barcode]) {
          newArr.push(arr[i])
          obj[arr[i].barcode] = true
        } else {
          _showFailToast('条码不能重复扫描')
        }
      }
      dataMap.dataList = newArr
      dataMap.detailsForm.num = dataMap.dataList.length // 已扫条码数量
      // dataMap.dataList = data
      // console.log(res.message,'ness')
      // console.log(form.value.message,'qqq')
    } else {
      form.value.message = res.message as string
    }
  })
}
function removeItem(item: any) {
  showConfirmDialog({
    title: '标题',
    message: '确定要删除吗？'
  }).then(() => {
    const index = dataMap.dataList.indexOf(item)
    dataMap.dataList.splice(index, 1)
  })
}
function handleClear() {
  form.value = {
    date: today,
    locationId: '',
    boxId: '',
    imBarcode: '',
    warehouseID: '',
    message: ''
  }
}
// 上架
function handleConfirm() {
  dataMap.loading = true
  var barcode: any[] = [] // 扫过的条码集合
  dataMap.dataList.forEach((item: any) => {
    barcode.push(item.barcode)
  })
  let data = {
    boxID: form.value.boxId,
    barcodes: barcode,
    sourceOrder: dataMap.detailsForm.receiptID, // 单号
    locationID: form.value.locationId,
    warehouseID: form.value.warehouseID
  }
  WMSAPI.post(APIName, data, 'pda/ArriveMaterialBandingBox').then((res) => {
    if (res.success) {
      showSuccessToast(res.message as string)
      dataMap.loading = false
      form.value = {
        date: today,
        locationId: '',
        boxId: '',
        imBarcode: '',
        warehouseID: '',
        message: ''
      }
    } else {
      _showFailToast(res.message as string)
      dataMap.loading = false
    }
  })
}
// 搜索
function search(value: string) {
  // console.log(value, '1345')
  let data = dataMap.dataList.filter((item: any) => item.barcode === value)
  dataMap.dataList = data
}
</script>

<style scoped>
::v-deep .van-form {
  margin: 0px auto !important;
}

::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
</style>
