<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <!-- 宫格统计栏 -->
  <!-- <div v-if="dataMap.listData.length > 0" class="bar cellGroup">
    <div class="time">{{ timeTitle }} {{ getDateStr() }}</div>
    <van-grid direction="horizontal" :column-num="3" :border="false">
      <van-grid-item>
        <div slot="text" class="text-wrap">
          <span>总数:</span>
          <span>{{ listData.length }}</span>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div slot="text" class="text-wrap">
          <span>创建:</span>
          <span>{{ creatNum }}</span>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div slot="text" class="text-wrap">
          <span>退货中:</span>
          <span>{{ runNum }}</span>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div slot="text" class="text-wrap">
          <span>退料完成:</span>
          <span>{{ readyNum }}</span>
        </div>
      </van-grid-item>
      <van-grid-item>
        <div slot="text" class="text-wrap" @click="checkedClick">
          <span>已扫描:</span>
          <span>{{ checkedData.length }}</span>
        </div>
      </van-grid-item>
    </van-grid>
  </div> -->
  <div class="details" v-if="dataMap.listData.length > 0">
    <!-- <div class="time">日期{{ getDateStr() }}</div> -->
    <van-sticky :offset-top="46" style="width: 95%; margin: 0 auto">
      <van-grid direction="horizontal" :column-num="3" :border="false">
        <van-grid-item>总数: {{ dataMap.listData.length }}</van-grid-item>
        <van-grid-item>创建: {{ creatNum }}</van-grid-item>
        <van-grid-item>退货中：{{ runNum }}</van-grid-item>
        <van-grid-item>退料完成：{{ readyNum }}</van-grid-item>
        <van-grid-item @click="barcodeClick">已扫描：{{ dataMap.checkedData.length }}</van-grid-item>
      </van-grid>
      <!-- <van-grid direction="horizontal" :column-num="3" :border="false">
      <van-grid-item>退货中：{{ runNum }}</van-grid-item>
      <van-grid-item>退料完成：{{ readyNum }}</van-grid-item>
      <van-grid-item>已扫描：{{ checkedData.length }}</van-grid-item>
    </van-grid> -->
    </van-sticky>
  </div>
   <van-tabs v-model:active="active" v-if="dataMap.listData.length > 0">
    <van-tab title="退料明细">
      <DetailsVue v-for="(item,index) in dataMap.listData" :key="index" v-model:formData="dataMap.listData[index]" :formList="dataMap.detailsList" :label-width="60"></DetailsVue>
    </van-tab>
    <!-- <van-tab title="已扫标签">
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
    </van-tab> -->
  </van-tabs>
  <!-- 已扫描查看弹窗 -->
  <van-popup v-model:show="dataMap.isLookPack" round :style="{ width: '90%', height: '300px' }" closeable>
    <div class="un-pack-info">
      <div style="padding-left: 5px">
        <p style="width: 90%">已扫描:</p>
        <van-tag
          v-for="item in dataMap.checkedData"
          :key="item.barcode"
          closeable
          size="medium"
          type="primary"
          style="margin: 5px 5px"
          @close="tagDel(item)"
        >
          {{ item.barcode }}
        </van-tag>
      </div>
    </div>
  </van-popup>
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
import { ref, reactive, onMounted, computed } from 'vue'
import Dates from '@/utils/datetime'
import { validateBarcode } from '@/utils/validate'
import { formList, detailsList } from './config'
import { showSuccessToast, showConfirmDialog } from 'vant'
import { _showFailToast } from '@/utils/message'
const formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let boxInputRef: FieldInstance | null = null
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const time = new Dates(new Date()).strftime('H:m:s')
const form = ref({
  date: today,
  returnOrder: '',
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
  listData: [] as any,
  loading: false,
  confirmText: '确定',
  deliverynoteID: '',
  // barcodes: [] as any
  isLookPack: false, // 是否显示查看弹窗
  checkedData: [] as any
})
const creatNum = computed(() => {
  let num = 0
  for (let item of dataMap.listData) {
    if (item.state === '创建') {
      num++
    }
  }
  return num
})
const runNum = computed(() => {
  let num = 0
  for (let item of dataMap.listData) {
    if (item.state === '退货中') {
      num++
    }
  }
  return num
})
const readyNum = computed(() => {
  let num = 0
  for (let item of dataMap.listData) {
    if (item.state === '退料完成') {
      num++
    }
  }
  return num
})
const numFinsihTransfer = computed(() => {
  let num = 0
  for (let item of dataMap.listData) {
    if (item.state === '转库完成') {
      num++
    }
  }
  return num
})
onMounted(() => {
  getDict()
  getDateAuthority()
  initConfig()
  let returnOrder = formComponent.value?.formInputRef.returnOrder.inputRef
  returnOrder.focus()
})
// 获取当前日期
function getDateStr() {
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1
  let day = time.getDate()
  return year + '-' + month + '-' + day
}
// 获取日期权限
function getDateAuthority() {
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
    if (res.success) dataMap.formList[5].type = 'Calendar'
    else dataMap.formList[5].type = 'Text'
  })
}
// 获取仓库
function getDict(val) {
  WMSAPI.get(APIName, { IsPage: false }, 'warehouse/all').then((res) => {
    // if(res.items.length === 0){
    //   form.value.message = '请在web仓库管理配置物料组!'
    //   return
    // }
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
dataMap.formList[4].enter = getLocation
// 获取货位编码
function getLocation() {
  if (form.value.locationId) {
    let barcodes = dataMap.checkedData.map((item) => item.barcode)
    let data = {
      returnID: form.value.returnOrder,
      boxID: form.value.boxId,
      locationID: form.value.locationId,
      warehouseID: form.value.warehouseID,
      barCode: barcodes
    }
    WMSAPI.post(APIName, data, 'pda/ReturnBandingBox').then((res) => {
      if (res.success === true) {
        form.value.message = res.message as string
        setTimeout(() => {
          getOrder()
        }, 2000)
      }else {
        form.value.message = res.message as string
      }
    })
  } else {
    form.value.message = '请输入货位编码'
  }
}
dataMap.formList[3].enter = getBox
// 获取载具信息
function getBox() {
  if (form.value.boxId) {
    WMSAPI.get(APIName, { boxID: form.value.boxId }, 'box/GetBoxInfo').then((res) => {
      if (res.success == false || res.success == true) form.value.message = res.message as string
    })
  } else {
    form.value.message = '请输入载具编码'
  }
}
dataMap.formList[1].enter = getOrder
// 获取退料单号
function getOrder() {
  WMSAPI.get(APIName, { ReturnID: form.value.returnOrder }, 'returnorder/GetDetails').then((res) => {
    if (res.details !== null && res.header !== null) {
      if (res.header.status === 'Finish') {
        form.value.message = '该单据已完成'
        return
      }
      res.details.forEach(item => {
        item.quantity = item.quantity+ "  "+item.unitID
      })
      dataMap.listData = res.details
    } else {
      form.value.message = '该单据不存在'
    }
  })
}
// 扫描标签条码
dataMap.formList[2].enter = getbarcode
function getbarcode() {
  if (form.value.returnOrder === '' || form.value.returnOrder === null || form.value.returnOrder === undefined) {
    form.value.message = '请先扫描退料单号！'
  } else {
    let barcode = form.value.imBarcode
    if (dataMap.checkedData.findIndex((item) => item.barcode === barcode) < 0) {
      //  console.log('1111')
      dataMap.checkedData.unshift({ barcode })
      form.value.message = '扫描成功'
      //  form.value.imBarcode = ''
      setTimeout(() => {
        boxInputRef?.focus()
        form.value.imBarcode = ''
      }, 0)
    } else {
      _showFailToast('请勿扫描重复的条码！')
    }
    // console.log(hasDuplicates(dataMap.checkedData))
    // let names = dataMap.checkedData.map((item) => item[barcode])
    // let nameSet = new Set(names)
    // if (nameSet.size == names.length) {
    //   console.log('没有重复值')
    // } else {
    //
    // }
  }
}
// function hasDuplicates(array) {
//   debugger
//   return array.filter((value, index) => array.indexOf(value.barcode) !== index).length > 0
// }
// 点击扫描标签弹窗
function barcodeClick() {
  if (dataMap.checkedData.length !== 0) {
    dataMap.isLookPack = true
  } else {
    form.value.message = '当前明细的已扫描数据为空！'
  }
}
// 删除扫描标签
function tagDel(tagItem) {
  let delIdx = dataMap.checkedData.findIndex((item) => item.barcode === tagItem.barcode)
  if (delIdx !== -1) {
    dataMap.checkedData.splice(delIdx, 1)
  }
}
// 清除
function handleClear() {
  form.value = {
    date: today,
    locationId: '',
    boxId: '',
    imBarcode: '',
    warehouseID: '',
    message: ''
  }
  dataMap.detailsForm = {}
  dataMap.listData = []
}
// 确定
function handleConfirm() {
  WMSAPI.post(APIName, { returnID: form.value.returnOrder }, 'pda/ReturnInStock').then((res) => {
    if (res.success == true) {
      dataMap.loading = false
      form.value = {
        date: today,
        returnOrder: '',
        locationId: '',
        boxId: '',
        imBarcode: '',
        warehouseID: '',
        message: res.message as string
      }
      dataMap.detailsForm = {}
      dataMap.listData = []
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
      boxInputRef = formComponent.value?.formInputRef[item.prop].inputRef
    }
  })
}
// 搜索
function search(value: string) {
  //console.log(value, '1345')
  let data = dataMap.dataList.filter((item: any) => item.barcode == value)
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
.form {
  margin-top: 12px;
}

/deep/ .van-grid-item {
  font-size: 12px;
}
::v-deep .van-grid-item__content {
  padding: 5px !important;
}
.details {
  width: 95%;
  margin: 0px auto 10px auto;
  background: #ffffff;
}
.time {
  padding: 6px 16px;
  text-align: left;
}
</style>
