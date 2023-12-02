<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="dataMap.detailsForm.length > 0">
    <van-tab title="备料明细">
      <!-- <InfoVue v-for="(item, index) in dataMap.detailsForm" :key="index" :list="dataMap.detailsForm[index]"></InfoVue> -->
      <DetailsVue v-for="(item, index) in dataMap.detailsForm" :key="index" v-model:formData="dataMap.detailsForm[index]" :formList="dataMap.detailsList" :label-width="60"></DetailsVue>
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
import InfoVue from '@/components/Info/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import TableContent from '@/components/tableContent/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import { WMSAPI } from '@/api/generalAPI'
import { ref, reactive, onMounted } from 'vue'
import { formList, detailsList } from './config'
import { showSuccessToast, showConfirmDialog } from 'vant'
import { _showFailToast } from '@/utils/message'
import Dates from '@/utils/datetime'
import { validateBarcode } from '@/utils/validate'
const formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const time = new Dates(new Date()).strftime('H:m:s')
const form = ref({
  date: today,
  purchaseOrder: '',
  imBarcode: '',
  message: ''
})
const listArray = ref({
  pickItemNo: '',
  materialDesc: '',
  schedule: ''
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
const dataList = [
  {
    barcode: '条码1',
    quantity: '200',
    lowestPrice: '2023-06-01',
    highestPrice: '2.35'
  },
  {
    barcode: '条码2',
    quantity: '150',
    lowestPrice: '2023-06-02',
    highestPrice: '3.35'
  },
  {
    barcode: '条码3',
    quantity: '180',
    lowestPrice: '2023-06-03',
    highestPrice: '2.35'
  }
]
const APIName = 'business'
const active = ref(0)
let dataMap = reactive({
  value: '',
  formList,
  detailsList,
  newBarcode: '',
  form: {} as any,
  detailsForm: [] as any,
  // detailsForm: [{ pickItemNo: 111, schedule: 100 }, { pickItemNo: 111, schedule: 101 }, { pickItemNo: 111, schedule: 102 }],
  columns: columns,
  dataList: [] as any,
  loading: false,
  confirmText: '确定'
})
onMounted(() => {
  getDateAuthority()
  let purchaseOrder = formComponent.value?.formInputRef.purchaseOrder.inputRef
  purchaseOrder.focus()
})
// function color(){
//   debugger
//   dataMap.detailsForm.forEach((item: any) => {
//      if(item.schedule == 100){
//       debugger
//       return 'background:#D9F7BE'
//      }else{
//       return 'background:#ffffff'
//      }
//     })
//   }
// 获取日期权限
function getDateAuthority() {
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
    if (res.success) dataMap.formList[2].type = 'Calendar'
    else dataMap.formList[2].type = 'Text'
  })
}
dataMap.formList[0].enter = getOrder
// 获取单据号
function getOrder() {
  if (form.value.purchaseOrder) {
    WMSAPI.get(APIName, { PickID: form.value.purchaseOrder }, 'pickorder/GetDetails/PDA').then((res) => {
      let imBarcode = formComponent.value?.formInputRef.imBarcode.inputRef
      imBarcode.focus()
      if (res.success == true) {
        res.data.details.forEach(item => {
          item.readyNum = item.rate.substring(0,item.rate.indexOf('/')) // 已备数量
        })
        dataMap.detailsForm = res.data.details
        var newList: any = []  // 标签明细
        res.data.header.pickBarcodeDetails.forEach((item: any) => {
        newList.push({ barcode: item.pickBarcode, quantity: item.quantity, time: time })
      })
      dataMap.dataList = newList
        // getCheckcode()
      }
      // console.log(dataMap.detailsForm.length, 'details')
    })
  } else {
    form.value.message = '请输入单据号'
  }
}
function getCheckcode() {
  WMSAPI.get(APIName, { PickID: form.value.purchaseOrder }, 'pickorder/CheckBarCode').then((res) => {
    if (res.success === true) {
      form.value.message = res.message
      dataMap.newBarcode = res.data.barcode
    } else {
      form.value.message = res.message
    }
  })
}
dataMap.formList[1].enter = getBarcode
// 获取标签条码
function getBarcode() {
  if (form.value.imBarcode) {
    //固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
    let Barcode = ''
    if (form.value.imBarcode.indexOf('#') !== -1) {
      Barcode = validateBarcode(form.value.imBarcode)
    } else {
      Barcode = form.value.imBarcode
    }
    pickBarcode(Barcode)
  } else {
    form.value.message = '请输入标签条码'
  }
}
function pickBarcode(val) {
  let Barcode = ''
  if (val.indexOf('#') !== -1) {
    Barcode = validateBarcode(val)
  } else {
    Barcode = val
  }
  let data = {
    pickID: form.value.purchaseOrder,
    barcode: Barcode,
    isCheckBatch: true
  }
  WMSAPI.post(APIName, data, 'pickorder/PickBarCode').then((res) => {
    if(res.success === true && res.result != 101) {
      form.value.message = res.message as string
      var newList: any = []
      res.data.pickBarcodeDetails.forEach((item: any) => {
        newList.push({ barcode: item.pickBarcode, quantity: item.quantity, time: time })
      })
      // console.log(newList, 'newList')
      dataMap.dataList = newList
    }
    else if (res.success === true && res.result == 101) {
      showConfirmDialog({
    title: '标题',
    message: res.message
  })
    .then(() => {
     // on confirm
     WMSAPI.post(APIName, {pickID: form.value.purchaseOrder, barcode: Barcode, isCheckBatch: false}, 'pickorder/PickBarCode').then((res) => {
      getOrder()
      form.value.message = res.message as string
      //dataMap.dataList.push({ barcode: res.data.pickBarcodes, quantity: res.data.quantity as Number, time: time })
      var newList: any = []
      res.data.pickBarcodeDetails.forEach((item: any) => {
        newList.push({ barcode: item.pickBarcode, quantity: item.quantity, time: time })
      })
      // console.log(newList, 'newList')
      dataMap.dataList = newList
      let arr = dataMap.dataList
      let newArr = [] as any
      let obj = {} as any
      for (let i = 0; i < arr.length; i++) {
        //将arr[i].barcode作为对象属性进行判断
        // console.log(obj[arr[i].barcode])
        if (!obj[arr[i].barcode]) {
          newArr.push(arr[i])
          obj[arr[i].barcode] = true
        } else {
          _showFailToast('条码不能重复扫描')
        }
      }
      // console.log(newArr, 'newArr')
      dataMap.dataList = newArr
      form.value.imBarcode = ''
     })
    })
    .catch(() => {
      form.value.imBarcode = ''
    })
    } else {
      form.value.message = res.message as string
    }
  })
}
function removeItem(item: any) {
  // const index = dataMap.dataList.indexOf(item)
  // if (index !== -1) {
  //   dataMap.dataList.splice(index, 1)
  // }
  showConfirmDialog({
    title: '标题',
    message: '确定要删除吗？'
  })
    .then(() => {
      // on confirm
      // 删除行
      const index = dataMap.dataList.indexOf(item)
      WMSAPI.post(APIName, { PickID: form.value.purchaseOrder, Barcode: item.barcode }, 'pickorder/DelBarCode').then((res) => {
        if(res.success === true){
          dataMap.dataList.splice(index, 1)
          showSuccessToast(res.message as string)
        }else {
          _showFailToast(res.message as string)
        }
      })
    })
    .catch(() => {
      // on cancel
    })
}
function search(value: string) {
  let data = dataMap.dataList.filter((item: any) => item.barcode == value)
  dataMap.dataList = data
}
// 确定
function handleConfirm() {
  let data = {
    pickID: form.value.purchaseOrder
  }
  WMSAPI.post(APIName, data, 'pda/ReadyMaterial').then((res) => {
    if (res.success == true) {
      form.value = {
        date: today,
        purchaseOrder: '',
        imBarcode: '',
        message: res.message as string
      }
      dataMap.detailsForm = []
      dataMap.dataList = []
    }else{
      form.value.message = res.message as string
    }
    // } else {
    //   if (res.result == 101) {
    //     showConfirmDialog({
    //       title: '',
    //       message: res.message
    //     })
    //       .then(() => {
    //         let data = {
    //           pickID: form.value.purchaseOrder,
    //           isPost: true
    //         }
    //         WMSAPI.post(APIName, data, 'pda/ReadyMaterial').then((res) => {
    //           form.value.message = res.message as string
    //         })
    //       })
    //       .catch(() => {
    //         let data = {
    //           pickID: form.value.purchaseOrder,
    //           isPost: false
    //         }
    //         WMSAPI.post(APIName, data, 'pda/ReadyMaterial').then((res) => {
    //           form.value.message = res.message as string
    //         })
    //       })
    //   } else {
    //     _showFailToast(res.message as string)
    //   }
    // }
  })
}
// 清除
function handleClear() {
  form.value = {
    date: today,
    purchaseOrder: '',
    imBarcode: '',
    message: ''
  }
  dataMap.detailsForm = []
  dataMap.dataList = []
}
</script>

<style scoped>
/* /deep/ .van-form {
  margin: 0px auto 0px auto !important;
} */

.form {
  margin-top: 12px;
}

::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
::v-deep .van-cell__value {
  word-break: break-all;
}
</style>
