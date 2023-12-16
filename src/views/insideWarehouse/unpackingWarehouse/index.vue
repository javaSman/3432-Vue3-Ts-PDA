<template>
  <FormVue class="form" ref="formComponent" v-model:formData="dataMap.form" :formList="dataMap.formList" />
  <!-- <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" v-show="dataMap.show"></DetailsVue> -->
  <!-- <div style="background:#fff;">新增拆出数量</div> -->
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
import { reactive, ref, onMounted } from 'vue'
import { validateBarcode } from '@/utils/validate'
import { WMSAPI } from '@/api/generalAPI'
import { formList, detailsList } from './config'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const APIName = 'business'
let dataMap = reactive({
  list: [] as any[],
  formList,
  detailsList,
  form: { share: 1 } as any,
  detailsForm: {} as any,
  show: false,
  loading: false,
  confirmText: '确定'
})
onMounted(() => {
  // 进入页面光标的位置
  dataMap.formList.forEach((item) => {
    if (item.prop === 'barcode') {
      let barcodeInputRef = formComponent.value?.formInputRef[item.prop].inputRef
      barcodeInputRef?.focus()
    }
  })
})
dataMap.formList[0].enter = getDetails
function getDetails() {
  if (dataMap.form.barcode) {
    // 固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
    let Barcode = ''
    if (dataMap.form.barcode.indexOf('#') !== -1) {
      Barcode = validateBarcode(dataMap.form.barcode)
    } else {
      Barcode = dataMap.form.barcode
    }
    WMSAPI.get(APIName, { barcode: Barcode }, 'materialsbarcode/GetBarcode').then((res) => {
      if (res.success) {
        dataMap.form.quantity = res.data.quantity
      }
    })
  } else {
    // form.value.message = '请输入单据号'
  }
}
dataMap.formList[3].enter = getQuantity
dataMap.formList[4].enter = getQuantity
function getQuantity() {
  if (dataMap.form.quantity) {
    dataMap.form.remainQuantity = dataMap.form.quantity - dataMap.form.spliceQuantity * dataMap.form.share
  }
}
function handleClear() {
  dataMap.form = {}
}
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    if (dataMap.form.barcode.indexOf('#') !== -1) {
      dataMap.form.barcode = validateBarcode(dataMap.form.barcode)
    }
    let data = {
      barcode: dataMap.form.barcode,
      quantity: dataMap.form.spliceQuantity,
      share: dataMap.form.share
    }
    if (!dataMap.form.spliceQuantity || dataMap.form.spliceQuantity === 0) {
      dataMap.form.message = '拆出数量不能为0'
      return
    }
    WMSAPI.post(APIName, data, 'pda/ApartLabelList').then((res) => {
      if (res && res.success) {
        dataMap.form.message = res.message as string
        dataMap.form = {}
      } else {
        dataMap.form.message = res.message as string
      }
    })
  })
}
</script>
