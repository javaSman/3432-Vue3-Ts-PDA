<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="dataMap.detailsForm.length > 0">
    <van-tab title="收货明细">
      <DetailsVue
        v-for="(item, index) in dataMap.detailsForm"
        :key="index"
        v-model:formData="dataMap.detailsForm[index]"
        :formList="dataMap.detailsForm[index].detailsList"
        :label-width="50"
        :supplierConfig="dataMap.detailsForm[index].multiLine"
        :index="index"
        @supplierList="getSupplierList(dataMap.detailsForm[index])"
        :detailsForm="dataMap.detailsForm"
        :isRules="dataMap.isRules"
      />
    </van-tab>
    <!-- <van-tab title="不可收货明细"> -->
    <!-- <TableContent :columns="dataMap.columns" :dataSource="dataMap.dataList">
        <template v-slot:changeMsg="{ content }">
          {{ content.changeMsg }}
        </template>
        <template v-slot:currentPrice="{ content }">
          {{ content.currentPrice }}
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
      </TableContent> -->
    <!-- </van-tab> -->
  </van-tabs>
  <!-- <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" v-show="dataMap.show"></DetailsVue> -->
  <ActionBarVue
    ref="actionBarVue"
    :loading="dataMap.loading"
    :confirmText="dataMap.confirmText"
    @clear="handleClear"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts">
// 物料收货
const cachedName = 'warehousing.materialReceipt'
export default {
  name: cachedName
}
</script>
<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import ToggleFormVue from '@/views/businessComponents/ToggleForm.vue'
import TableDialogVue from '@/views/businessComponents/TableDialog.vue'
import { WMSAPI } from '@/api/generalAPI'
import { ref, reactive, onMounted } from 'vue'
import Dates from '@/utils/datetime'
import { formList, detailsList } from './config'
import { _showFailToast } from '@/utils/message'

let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let dataMap = reactive({
  list: [] as any[],
  formList,
  detailsList,
  // form: {} as any,
  detailsForm: [] as any,
  detailsFormClone: [] as any,
  // detailsForm:[{imBarcode:'1234',purchaseOrder:'物料编码1',nomenge:'',menge:20,receivingmenge:5},{imBarcode:'1234',purchaseOrder:'物料编码2',nomenge:'',menge:20,receivingmenge:2},{imBarcode:'1234',purchaseOrder:'物料编码3',nomenge:'',menge:20,receivingmenge:10}],
  show: false,
  loading: false,
  confirmText: '确定',
  supplierCode: '', // 供应商编号
  multiLineShow: false,
  multiList: [] as any,
  newList: [] as any,
  items: [
    {
      subArray: [
        { supplierBatch: 'value1', receivingNum: 'value2' },
        { supplierBatch: 'value3', receivingNum: 'value4' }
      ]
    }
  ],
  objectProperties: ['supplierBatch', 'receivingNum'], // 属性数组
  supplierConfig: [
    {
      supplierBatch: '',
      receivingNum: ''
    }
  ],
  ruleForm: {
    supplierConfig: [
      {
        // supplierBatch: '',
        // receivingNum: ''
      }
    ]
  },
  isRules: true // 明细供应商编码是否有校验规则标识
})
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const APIName = 'business'
const active = ref(0)
const form = ref({
  date: today,
  warehouse: '',
  purchaseOrder: '',
  supplierName: '',
  locID: '',
  materialID: '',
  message: ''
})
onMounted(() => {
  // getDict()
  let purchaseOrder = formComponent.value?.formInputRef.purchaseOrder.inputRef
  purchaseOrder.focus()
  dataMap.ruleForm.supplierConfig.forEach((item2: any, index2) => {
    item2[`supplierBatch${index2}`] = ''
    item2[`receivingNum${index2}`] = ''
  })
  // })
  getDateAuthority()
})
// 获取仓库
async function getDict(val: any, index: number) {
  const res: any = await WMSAPI.get(APIName, { IsPage: false, MaterialsGroup: val.materialsGroup }, 'warehouse/all')
  // await WMSAPI.get(APIName, { IsPage: false,MaterialsGroup:val }, 'warehouse/all').then((res) => {
  if (res.items.length === 0) {
    form.value.message = '请在web仓库管理配置物料组!'
    return
  }
  let selectIndex = index
  let array: any[] = []
  array = res.items as []
  array.forEach((item) => {
    item.label = item.warehouseName
    item.value = item.warehouseID
    // console.log(val.region)
    // if (val.region === item.warehouseID) {
    dataMap.detailsForm[selectIndex].wareHouseID = item.warehouseID
    // }
  })
  const detailsList = ref(dataMap.detailsForm[index].detailsList)
  detailsList.value[3].options = array
  detailsList.value[3].optionsTwo = JSON.parse(JSON.stringify(array))
}
// 获取日期权限
function getDateAuthority() {
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
    if (res.success) dataMap.formList[3].type = 'Calendar'
    else dataMap.formList[3].type = 'Text'
  })
}
dataMap.formList[0].enter = getDetails
// 获取采购订单收货明细
function getDetails() {
  // dataMap.show = true
  WMSAPI.get(APIName, { PO: form.value.purchaseOrder }, 'purchaseorder/GetOrderDetailsPDA').then((res) => {
    if (res.success) {
      if (res.data.header.purchOrderType === 'ZC01') {
        // 采购单号
        dataMap.detailsForm = res.data.details as any[]
        dataMap.detailsFormClone = JSON.parse(JSON.stringify(dataMap.detailsForm))
        form.value.message = res.message as string
        form.value.supplierName = (res.data.header.supplierCode + '-' + res.data.header.supplierName) as string
        dataMap.supplierCode = res.data.header.supplierCode as string
        dataMap.detailsForm.forEach((item: any, index: number) => {
          item.quantity === item.receivingQuantity
            ? (item.nomenge = '')
            : (item.nomenge = item.quantity - item.receivingQuantity + '  ' + item.unitID) // 未收数量
          item.multiLineIndex = index
          item[`multiLine${index}`] = dataMap.ruleForm.supplierConfig
          item.multiLine = JSON.parse(JSON.stringify(dataMap.supplierConfig))
          item.detailsList = JSON.parse(JSON.stringify(dataMap.detailsList))
          getDict(item, index)
          // console.log(item[`multiLine${index}`], 'multiLine数据')
        })
      } else {
        form.value.supplierName = res.data.header.supplierName as string
        dataMap.detailsForm = []
        form.value.message = '不属于采购订单号'
      }
    } else {
      form.value.message = res.message as string
    }
  })
}
// dataMap.formList[3].enter = getLocation
// 获取货位编码
function getLocation() {
  WMSAPI.get(APIName, { LocationID: form.value.locID }, 'pda/GetLocationsInfo').then((res) => {
    if (res.success) form.value.message = res.message as string
  })
}
dataMap.formList[2].enter = getMaterial
// 获取物料编码（筛选明细）
function getMaterial() {
  if (form.value.materialID) {
    let data = dataMap.detailsForm?.filter((item: any) => {
      let reg = new RegExp(form.value.materialID) // 正则模糊搜索
      return reg.test(item.materialID)
    })
    dataMap.detailsForm = data
  } else {
    dataMap.detailsForm = dataMap.detailsFormClone
  }
}
function handleInput(itemIndex, subItemIndex, propName) {
  // 当输入框的值改变时，将新值更新到其他输入框
  const value = this.items[itemIndex].subArray[subItemIndex][propName]
  dataMap.detailsForm.forEach((item) => {
    item.multiLine[subItemIndex][propName] = value
  })
}

// dataMap.detailsList[6].blur = handleblur
// function handleblur() {
//   console.log(111)
// }

// 清除
function handleClear() {
  form.value = {
    date: today,
    warehouse: '',
    purchaseOrder: '',
    supplierName: '',
    locID: '',
    maktx: '',
    message: ''
  }
  dataMap.detailsForm = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    let userInfo = localStorage.getItem('userInfo')
    let text = eval('(' + userInfo + ')')
    let array: any[] = []
    let result: any[] = []
    console.log('dataMap.detailsForm', dataMap.detailsForm)

    dataMap.detailsForm.forEach((item: any) => {
      let result1 = item.multiLine.every((res: any) => {
        res.supplierBatch = res.supplierBatch.replace(/\s/g, '') // 替换所有的空白字符为空字符串
        // 然后检查替换后的字符串是否都是数字并且是14位
        let isAllDigitsAnd14Chars = /^\d{14}$/.test(res.supplierBatch)
        // 截取前8位
        let firstEight = res.supplierBatch.substring(0, 8)
        // 截取后6位
        let lastSix = '20' + res.supplierBatch.slice(-6)
        let date = new Date() // 创建一个新的Date对象，它会自动被设置为当前日期和时间
        let year = date.getFullYear() // 获取年份
        let month = date.getMonth() + 1 // 获取月份（注意：月份是从0开始的，所以我们需要+1）
        let day = date.getDate() // 获取日期
        if (
          !isAllDigitsAnd14Chars ||
          firstEight !== item.supplierCode ||
          Number(lastSix) > Number(year + '' + month + '' + day) // 校验生产日期不能大于当前操作日期
        ) {
          return false
        } else {
          return true
        }
      })
      result.push(result1)
      array.push({
        poItemNo: item.poItemNo,
        materialID: item.materialID,
        wareHouseID: item.wareHouseID,
        item: item.multiLine
      })
    })
    if (result.includes(false)) {
      _showFailToast('供应商批次填写错误！')
      dataMap.loading = false
      return
    }
    let data = {
      po: form.value.purchaseOrder,
      wareHouseID: form.value.warehouse,
      receivingDate: form.value.date,
      locationsID: form.value.locID,
      supplierCode: dataMap.supplierCode,
      controlPeople: text.account,
      controlPeopleName: text.name,
      inputMaterial: array
    }

    WMSAPI.post(APIName, data, 'pda/ArriveMaterial').then((res) => {
      if (res.success === true) {
        dataMap.loading = false
        // form.value.message = res.message as string
        form.value = {
          date: today,
          warehouse: '',
          purchaseOrder: '',
          supplierName: '',
          locID: '',
          maktx: '',
          message: res.message as string
        }
        dataMap.detailsForm = []
      } else {
        form.value.message = res.message as string
        dataMap.loading = false
      }
    })
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
.multiLine .mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}

.multiLine .pop {
  width: 90%;
  height: 16rem;
  background: #fff;
  /* font-size: 62.5%; */
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -130px;
  margin-left: -169px;
  z-index: 10;
}
/* .multiLine {
  width:90%;
  height: 300px;
  background: red;
  z-index: 11111;
} */
</style>
