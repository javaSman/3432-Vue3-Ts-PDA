<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList"></DetailsVue>
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
const cachedName = 'outBound.materialPreparation'
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
import { reactive, ref } from 'vue'
import { validateBarcode } from '@/utils/validate'
import { WMSAPI } from '@/api/generalAPI'
import { formList, detailsList, tableColumn } from './config'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'
import { showSuccessToast } from 'vant'
import { _showFailToast } from '@/utils/message'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const APIName = 'business'
const form = ref({
  barcode: '',
  inBoxID: '',
  outBoxID: '',
  message: ''
})
let dataMap = reactive({
  list: [] as any[],
  barcodeList: [] as any[], // 标签集合
  formList,
  detailsList,
  form: {} as any,
  detailsForm: {} as any,
  // detailsForm:{
  //   imBarcode:'202301100034',
  //   barcode: '电解液',
  //   num: 2,
  //   batch: '20230110000009'
  // },
  show: false,
  loading: false,
  confirmText: '确定'
})
//dataMap.formList[0].options = [{ label: '01层', value: '01' },{ label: '02层', value: '02' },{ label: '03层', value: '03' },{ label: '04层', value: '04' }]
dataMap.formList[0].enter = getDetails
function getDetails() {
  //固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
  let Barcode = ''
  if (form.value.barcode.indexOf('#') !== -1) {
    Barcode = validateBarcode(form.value.barcode)
  } else {
    Barcode = form.value.barcode
  }
  dataMap.barcodeList.push(Barcode)
  WMSAPI.get(APIName, { barcode: Barcode }, 'boxdetails/GetBoxDetailsByBarcode').then((res) => {
    if (res.success == true) {
      form.value.message = res.message as string
      dataMap.detailsForm = res.data
      form.value.outBoxID = res.data.boxID
      form.value.barcode = ''
    }
  })
}
// 转入载具
dataMap.formList[2].enter = getInBox
function getInBox() {
  WMSAPI.get(APIName, { BoxID: form.value.inBoxID }, 'box/all').then((res) => {
    if (res.items) {
      form.value.message = '查询成功'
    }
  })
}
// 清除
function handleClear() {
  form.value.barcode = ''
  form.value.outBoxID = ''
  form.value.inBoxID = ''
  form.value.message = ''
  dataMap.barcodeList = []
  dataMap.detailsForm = {}
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    let data = {
      outBoxID: form.value.outBoxID,
      inBoxID: form.value.inBoxID,
      barcode: dataMap.barcodeList
    }
    WMSAPI.post(APIName, data, 'pda/TransferBox').then((res) => {
      if (res && res.success) {
        dataMap.loading = false
        showSuccessToast(res.message as string)
        form.value = {
          barcode: '',
          inBoxID: '',
          outBoxID: '',
          message: ''
        }
        dataMap.detailsForm = []
      } else {
        _showFailToast(res.message as string)
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
</style>
