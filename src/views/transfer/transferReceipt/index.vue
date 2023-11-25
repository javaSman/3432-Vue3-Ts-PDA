<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-sticky :offset-top="46" style="width:95%; margin: 0 auto;">
    <van-grid direction="horizontal" :column-num="2" :border="false">
      <van-grid-item>转入仓库 {{ header.inWarehouseCode }}</van-grid-item>
      <van-grid-item>转出仓库 {{ header.outWarehouseCode }}</van-grid-item>
    </van-grid>
    <van-grid direction="horizontal" :column-num="4" :border="false">
      <van-grid-item>申请转库：{{ numApplyTransfer }}</van-grid-item>
      <van-grid-item>转库中：{{ numTransfering }}</van-grid-item>
      <van-grid-item>拣料完成：{{ FinsihPicking }}</van-grid-item>
      <van-grid-item>转库完成：{{ numFinsihTransfer }}</van-grid-item>
    </van-grid>
  </van-sticky>
  <ListVue v-for="(item, index) in dataMap.details" :listTitle="dataMap.listTitle" :field="true"
    v-model:formData="dataMap.details[index]" :formList="dataMap.detailsList" :showForm="dataMap.details[index]"
    :showFormList="dataMap.showFormList" :index="index">
  </ListVue>
  <ActionBarVue ref="actionBarVue" :loading="dataMap.loading" :confirmText="dataMap.confirmText" @clear="handleClear"
    @confirm="handleConfirm" />
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
import { reactive, ref, computed } from 'vue'
import { validateBarcode } from '@/utils/validate'
import { formList, detailsList, showFormList, tableColumn } from './config'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'
import { WMSAPI } from '@/api/generalAPI'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const APIName = 'business'
// 表单
const form = ref(
  {
    purchaseOrder: '',
    imBarcode: '',
    boxId: '',
    locationId: '',
    message: ''
  })
// header
const header = ref(
  {
    inWarehouseCode: '',
    outWarehouseCode: ''
  }
)
let dataMap = reactive({
  list: [] as any[],
  formList,
  showFormList,
  detailsList,
  form: {} as any,
  showData: {} as any,
  detailsForm: {} as any,
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
        showForm: { delivnum: 111, sgtxt4: '转库单1', lifnr: '1', ebeln: 'edfg' }
      }, {
        form: {
          date: '20160502',
          name: '李小虎'
        },
        showForm: { delivnum: 222, sgtxt4: '转库单2', lifnr: '2', ebeln: 'abcd' }
      }, {
        form: {
          date: '20160502',
          name: '王小虎'
        },
        showForm: { delivnum: 333, sgtxt4: '转库单3', lifnr: '3', ebeln: 'dfhhj' }
      }, {
        form: {
          date: '20160502',
          name: '李小虎'
        },
        showForm: { delivnum: 444, sgtxt4: '转库单4', lifnr: '4', ebeln: 'ylg,f' }
      }]
  },
  show: false,
  loading: false,
  listTitle: '转库单明细',
  confirmText: '确定'
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
const numApplyTransfer = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '申请转库') {
      num++
    }
  }
  return num
})
const numTransfering = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '转库中') {
      num++
    }
  }
  return num
})
const numFinsihTransfer = computed(() => {
  let num = 0
  for (let item of dataMap.details) {
    if (item.state === '转库完成') {
      num++
    }
  }
  return num
})
dataMap.formList[0].enter = getDetails
function getDetails() {
  if (form.value.purchaseOrder) {
    WMSAPI.get(APIName, { OrderId: form.value.purchaseOrder }, 'allocationorder/GetDetails').then((res) => {
      //form.value.message = res.message as string
      header.value.inWarehouseCode = res.header.inWarehouseCode as string
      header.value.outWarehouseCode = res.header.outWarehouseCode as string
      dataMap.details = res.details
    })
  } else {
    form.value.message = '请输入转库单号'
  }
}
dataMap.formList[2].enter = getLocation
// 获取货位编码
function getLocation() {
  if (form.value.locationId) {
    WMSAPI.get(APIName, { LocationID: form.value.locationId }, 'pda/GetLocationsInfo').then((res) => {
      if (res.success == true) { form.value.message = res.message as string }
      else { form.value.message = res.message as string }
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
      if (res.success == false || res.success == true) form.value.message = res.message as string
    })
  } else {
    form.value.message = '请输入载具编码'
  }
}
dataMap.formList[3].enter = getBarcodes
function getBarcodes() {
  if (form.value.imBarcode) {
     //固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
     let Barcode = ''
    if (form.value.imBarcode.indexOf('#') !== -1) {
      Barcode = validateBarcode(form.value.imBarcode)
    } else {
      Barcode = form.value.imBarcode
    }
    WMSAPI.post(APIName, { allocationID: form.value.purchaseOrder, barcodes: [Barcode],BoxID: form.value.boxId,LocationID:form.value.locationId }, 'allocationorder/ReceiveBarCode').then((res) => {
      if (res.success == true) {
        form.value.message = res.message as string
        header.value.inWarehouseCode = res.header.inWarehouseCode as string
        header.value.outWarehouseCode = res.header.outWarehouseCode as string
        dataMap.details = res.details
      }else {
        form.value.message = res.message as string
      }
    })
  } else {
    form.value.message = '请输入标签条码'
  }
}
// 清除
function handleClear() {
  form.value.purchaseOrder = ''
  form.value.imBarcode = ''
  form.value.boxId = ''
  form.value.locationId = ''
  form.value.message = ''
  dataMap.details = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    WMSAPI.post(APIName, { allocationID: form.value.purchaseOrder, barcode: form.value.imBarcode }, 'allocationorder/ReceiveSubmit').then((res) => {
      if (res.success == true) {
        dataMap.loading = false
        form.value.message = res.message as string
        form.value.purchaseOrder = ''
        form.value.imBarcode = ''
        form.value.boxId = ''
        form.value.locationId = ''
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

/deep/ .van-grid-item {
  font-size: 12px;
}
</style>