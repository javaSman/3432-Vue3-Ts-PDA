<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="dataMap.detailsForm.length > 0">
    <van-tab title="明细">
      <DetailsVue
        v-for="(item, index) in dataMap.detailsForm"
        :key="index"
        v-model:formData="dataMap.detailsForm[index]"
        :formList="dataMap.detailsList"
        :label-width="60"
      />
    </van-tab>
    <van-tab title="已扫标签">
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
import { showConfirmDialog, FieldInstance } from 'vant'
import { _showFailToast } from '@/utils/message'
const formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let barcodeInputRef: FieldInstance | null = null
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const time = new Dates(new Date()).strftime('H:m:s')
const form = ref({
  date: today,
  orderId: '',
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
  confirmText: '确定',
  deliverynoteID: ''
})
onMounted(() => {
  getOrder()
  initConfig()
  getDateAuthority()
})
// 获取日期权限
function getDateAuthority() {
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
    if (res.success) dataMap.formList[4].type = 'Calendar'
    else dataMap.formList[4].type = 'Text'
  })
}

dataMap.formList[3].enter = getLocation
// 获取货位编码
function getLocation() {
  if (form.value.locationId) {
    WMSAPI.get(APIName, { LocationID: form.value.locationId }, 'locations/GetLocations').then((res) => {
      if (res.success) {
        if (res.data.warehouseID === '8001') {
          form.value.message = res.message as string
        } else {
          form.value.message = '货位不属于报废仓库'
        }
      } else {
        form.value.message = res.message as string
      }
    })
  } else {
    form.value.message = '请输入货位编码'
  }
}
dataMap.formList[2].enter = getBox
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
// 获取单号明细
dataMap.formList[0].change = getOrderDetails
function getOrderDetails() {
  WMSAPI.get(APIName, { OrderId: form.value.orderId }, 'wasteorder/GetDetails').then((res) => {
    dataMap.detailsForm = res.details
  })
}
// 获取单号
function getOrder() {
  WMSAPI.get(APIName, { OrderStatus: 'Create,Run', IsPage: false }, 'wasteOrder/all').then((res) => {
    let array: any[] = []
    array = res.items as []
    array.filter((item) => {
      item.text = item.orderID
      item.value = item.orderID
    })
    dataMap.formList[0].options = array
  })
}
dataMap.formList[1].enter = getBarcode
// 获取标签条码
function getBarcode() {
  // 固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
  let Barcode = ''
  if (form.value.imBarcode.indexOf('#') !== -1) {
    Barcode = validateBarcode(form.value.imBarcode)
  } else {
    Barcode = form.value.imBarcode
  }
  WMSAPI.get(APIName, { barcode: Barcode }, 'materialsbarcode/GetBarcode').then((res) => {
    if (res.success) {
      if (res.data.barcodeType === 'Waste' && res.data.deliverynoteID === form.value.orderId) {
        barcodeInputRef?.focus()
        form.value.message = res.message as string
        dataMap.dataList.push({ barcode: res.data.barcode, quantity: res.data.quantity as number, time: time })
      } else {
        barcodeInputRef?.focus()
        form.value.message = '要扫描同个单号的固废标签'
      }
      // form.value.boxId = res.data.boxID as string
      // form.value.locationId = res.data.locationID as string
      // dataMap.detailsForm = res.details
      // let warehouseID = ''
      // if(dataMap.dataList.length === 0){
      //   dataMap.deliverynoteID = res.data.deliverynoteID
      //   warehouseID = res.data.warehouseID
      //   dataMap.dataList.push({ barcode: res.data.barcode, quantity: res.data.quantity as Number, time: time })
      //   form.value.imBarcode = ''
      // }else{
      //   if(res.data.deliverynoteID === dataMap.deliverynoteID){
      //     dataMap.dataList.push({ barcode: res.data.barcode, quantity: res.data.quantity as Number, time: time })
      //     form.value.imBarcode = ''
      //   }else{
      //     form.value.message = '要在同一个申请单并且同一个仓库扫描条码！'
      //   }
      // }
      form.value.imBarcode = ''
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
      barcodeInputRef?.focus()
      form.value.imBarcode = ''
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
    orderId: '',
    locationId: '',
    boxId: '',
    imBarcode: '',
    warehouseID: '',
    message: ''
  }
  dataMap.detailsForm = []
  dataMap.dataList = []
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
    sourceOrder: form.value.orderId, // 单号
    locationID: form.value.locationId
    // warehouseID: form.value.warehouseID
  }
  WMSAPI.post(APIName, data, 'pda/WasteInStock').then((res) => {
    if (res.success) {
      dataMap.loading = false
      form.value = {
        date: today,
        orderId: '',
        locationId: '',
        boxId: '',
        imBarcode: '',
        warehouseID: '',
        message: res.message as string
      }
      dataMap.detailsForm = []
      dataMap.dataList = []
    } else {
      dataMap.loading = false
      form.value.message = res.message as string
    }
  })
}
// 初始化配置项
function initConfig() {
  dataMap.formList.forEach((item) => {
    if (item.prop === 'imBarcode') {
      barcodeInputRef = formComponent.value?.formInputRef[item.prop].inputRef
      barcodeInputRef?.focus()
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
