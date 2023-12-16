<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-sticky :offset-top="46" style="width: 95%; margin: 0 auto">
    <van-grid direction="horizontal" :column-num="2" :border="false">
      <van-grid-item>转入仓库 {{ header.inWarehouseCode }}</van-grid-item>
      <van-grid-item>转出仓库 {{ header.outWarehouseCode }}</van-grid-item>
    </van-grid>
    <van-grid direction="horizontal" :column-num="3" :border="false">
      <!-- <van-grid-item>申请调拨：{{ numApplyTransfer }}</van-grid-item> -->
      <van-grid-item>发出中：{{ numTransfering }}</van-grid-item>
      <van-grid-item>发出完成：{{ FinsihPicking }}</van-grid-item>
      <van-grid-item>接收完成：{{ numFinsihTransfer }}</van-grid-item>
    </van-grid>
  </van-sticky>
  <ListVue
    v-for="(item, index) in dataMap.details"
    :key="index"
    :listTitle="dataMap.listTitle"
    :field="true"
    v-model:formData="dataMap.details[index]"
    :formList="dataMap.detailsList"
    :showForm="dataMap.details[index]"
    :showFormList="dataMap.showFormList"
    :index="index"
  />
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
const cachedName = 'transfer.transferOut'
export default {
  name: cachedName
}
</script>
<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import ListVue from '@/components/List/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import ToggleFormVue from '@/views/businessComponents/ToggleForm.vue'
import TableDialogVue from '@/views/businessComponents/TableDialog.vue'
import { reactive, ref, computed, onMounted } from 'vue'
import { validateBarcode } from '@/utils/validate'
import { formList, detailsList, showFormList } from './config'
import { FieldInstance } from 'vant'
import { WMSAPI } from '@/api/generalAPI'
let purchaseOrderInputRef: FieldInstance | null = null
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const APIName = 'business'
// 表单
const form = ref({
  purchaseOrder: '',
  imBarcode: '',
  message: ''
})
// header
const header = ref({
  inWarehouseCode: '',
  outWarehouseCode: ''
})
let dataMap = reactive({
  list: [] as any[],
  formList,
  showFormList,
  detailsList,
  form: {} as any,
  showData: {} as any,
  detailsForm: {} as any,
  header: {
    inWarehouseCode: '',
    outWarehouseCode: ''
  },
  details: [] as any,
  data: {
    boxIn: '1001',
    boxOut: '1002',
    transferNum: 4,
    transferNum2: 0,
    transferNum3: 0,
    transferNum4: 0,
    tableData: [
      {
        form: {
          date: '20160502',
          name: '王小虎'
        },
        showForm: { delivnum: 111, sgtxt4: '调拨单1', lifnr: '1', ebeln: 'edfg' }
      },
      {
        form: {
          date: '20160502',
          name: '李小虎'
        },
        showForm: { delivnum: 222, sgtxt4: '调拨单2', lifnr: '2', ebeln: 'abcd' }
      },
      {
        form: {
          date: '20160502',
          name: '王小虎'
        },
        showForm: { delivnum: 333, sgtxt4: '调拨单3', lifnr: '3', ebeln: 'dfhhj' }
      },
      {
        form: {
          date: '20160502',
          name: '李小虎'
        },
        showForm: { delivnum: 444, sgtxt4: '调拨单4', lifnr: '4', ebeln: 'ylg,f' }
      }
    ]
  },
  show: false,
  loading: false,
  listTitle: '调拨单明细',
  confirmText: '确定'
  // state: 'numApplyTransfer'
})
const FinsihPicking = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '拣料完成') {
      num++
    }
  }
  return num
})
// const numApplyTransfer = computed(() => {
//   let num = 0
//   for (let item of dataMap.details) {
//     if (item.state === '申请调拨') {
//       num++
//     }
//   }
//   return num
// })
const numTransfering = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '分拣中') {
      num++
    }
  }
  return num
})
const numFinsihTransfer = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '调拨完成') {
      num++
    }
  }
  return num
})
dataMap.formList[0].enter = getDetails
function getDetails() {
  if (form.value.purchaseOrder) {
    WMSAPI.get(APIName, { OrderId: form.value.purchaseOrder }, 'allocationorder/GetDetails').then((res) => {
      // form.value.message = res.message as string
      header.value.inWarehouseCode = res.header.inWarehouseCode as string
      header.value.outWarehouseCode = res.header.outWarehouseCode as string
      dataMap.details = res.details
      formComponent.value?.formInputRef['imBarcode'].inputRef?.focus()
    })
  } else {
    form.value.message = '请输入调拨单号'
  }
}
dataMap.formList[1].enter = getBarcodes
function getBarcodes() {
  if (form.value.imBarcode) {
    // 固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
    let Barcode = ''
    if (form.value.imBarcode.indexOf('#') !== -1) {
      Barcode = validateBarcode(form.value.imBarcode)
    } else {
      Barcode = form.value.imBarcode
    }
    WMSAPI.post(
      APIName,
      { allocationID: form.value.purchaseOrder, barcodes: [Barcode] },
      'allocationorder/SendOutBarCode'
    ).then((res) => {
      if (res.success) {
        form.value.message = res.message as string
        header.value.inWarehouseCode = res.header.inWarehouseCode as string
        header.value.outWarehouseCode = res.header.outWarehouseCode as string
        dataMap.details = res.details
        getDetails() // 扫描标签条码成功后，重新调一次获取调拨单接口，刷新PDA页面数据
      } else {
        form.value.message = res.message as string
      }
      form.value.imBarcode = ''
    })
  } else {
    form.value.message = '请输入标签条码'
  }
}
onMounted(() => {
  initConfig()
})
// 初始化配置项
function initConfig() {
  // 进入页面光标的位置
  dataMap.formList.forEach((item) => {
    if (item.prop === 'purchaseOrder') {
      purchaseOrderInputRef = formComponent.value?.formInputRef[item.prop].inputRef
      purchaseOrderInputRef?.focus()
    }
  })
}
// 清除
function handleClear() {
  form.value.purchaseOrder = ''
  form.value.imBarcode = ''
  form.value.message = ''
  dataMap.details = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    WMSAPI.post(
      APIName,
      { allocationID: form.value.purchaseOrder, barcodes: [form.value.imBarcode] },
      'allocationorder/SendOutSubmit'
    ).then((res) => {
      if (res.success) {
        dataMap.loading = false
        form.value.message = res.message as string
        form.value.purchaseOrder = ''
        form.value.imBarcode = ''
        dataMap.details = []
      }
    })
  })
}
</script>
<style scoped>
.form {
  margin-top: 12px;
}

:deep(.van-grid-item) {
  font-size: 12px;
}
</style>
