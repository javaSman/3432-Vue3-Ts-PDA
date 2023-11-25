<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="dataMap.dataList.length > 0">
    <van-tab title="盘点明细">
      <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" :label-width="60"></DetailsVue>
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
import FormVue from './module/form.vue'
import ListVue from '@/components/List/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import ToggleFormVue from '@/views/businessComponents/ToggleForm.vue'
import TableDialogVue from '@/views/businessComponents/TableDialog.vue'
import TableContent from '@/components/tableContent/index.vue'
import { reactive, ref, computed, onMounted } from 'vue'
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
    message: ''
  })
// header
const header = ref(
  {
    inWarehouseCode: '',
    outWarehouseCode: ''
  }
)
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
const active = ref(0)
let dataMap = reactive({
  list: [] as any[],
  formList,
  showFormList,
  detailsList,
  form: {} as any,
  showData: {} as any,
  detailsForm: {} as any,
  dataList: [] as any,
  header: {
    inWarehouseCode: '',
    outWarehouseCode: ''
  },
  details: [] as any,
  columns: columns,
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
  confirmText: '确定',
  // state: 'numApplyTransfer'
})
onMounted(() => {
  getDict()
})
// 获取仓库
function getDict(val) {
  WMSAPI.get(APIName, { IsPage: false }, 'warehouse/all').then((res) => {
    let array: any[] = []
    array = res.items as []
    array.forEach((item) => {
      item.label = item.warehouseName
      item.value = item.warehouseID
    })
    dataMap.formList[1].options = array
    dataMap.formList[1].optionsTwo = JSON.parse(JSON.stringify(array))
  })
}
dataMap.formList[0].enter = getDetails
function getDetails() {
  if (form.value.purchaseOrder) {
    WMSAPI.get(APIName, { OrderId: form.value.purchaseOrder }, 'allocationorder/GetDetails').then((res) => {
      //form.value.message = res.message as string
      header.value.inWarehouseCode = res.header.inWarehouseCode as string
      header.value.outWarehouseCode = res.header.outWarehouseCode as string
      dataMap.details = res.details
      form.value.message = res.message as string
    })
  } else {
    form.value.message = '请输入转库单号'
  }
}
dataMap.formList[1].enter = getBarcodes
function getBarcodes() {
  if (form.value.purchaseOrder) {
    WMSAPI.post(APIName, { allocationID: form.value.purchaseOrder, barcode: form.value.imBarcode }, 'allocationorder/SendOutBarCode').then((res) => {
      if (res.success == true) {
        header.value.inWarehouseCode = res.header.inWarehouseCode as string
        header.value.outWarehouseCode = res.header.outWarehouseCode as string
        dataMap.details = res.details
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
  dataMap.details = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    WMSAPI.post(APIName, { allocationID: form.value.purchaseOrder, barcode: form.value.imBarcode }, 'allocationorder/SendOutSubmit').then((res) => {
      if (res.success == true) {
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

/deep/ .van-grid-item {
  font-size: 12px;
}
</style>