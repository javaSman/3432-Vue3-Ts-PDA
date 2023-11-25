<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList"/>
 
      <DetailsVue v-model:formData="dataMap.detailsForm"
        :formList="dataMap.detailsList" :label-width="50"></DetailsVue>
  <!-- <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" v-show="dataMap.show"></DetailsVue> -->
  <ActionBarVue ref="actionBarVue" :loading="dataMap.loading" :confirmText="dataMap.confirmText" @clear="handleClear"
    @confirm="handleConfirm" />
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
import { validateBarcode } from '@/utils/validate'
import { formList, detailsList, showFormList, tableColumn } from './config'
import { showSuccessToast } from 'vant'
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
  supplierCode: '' //供应商编号
})
const APIName = 'business'
const active = ref(0);
const form = ref(
  {
    boxCode: '',
    purcbarCodehaseOrder: '',
    message: ''
  })
onMounted(() => {
   // getDict()
})
dataMap.formList[1].enter = getBarcode
function getBarcode(){
 //固废标签带有#的直接截取最后一个#后面的值，否则拿原有的值
 let Barcode = ''
  if(form.value.purcbarCodehaseOrder.indexOf("#") !== -1){
    Barcode = validateBarcode(form.value.purcbarCodehaseOrder)
  }else{
    Barcode = form.value.purcbarCodehaseOrder
  }
}
// 清除
function handleClear() {
  form.value = {
    boxCode: '',
    purcbarCodehaseOrder: '',
    message: ''
  }
  dataMap.detailsForm = []
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
  //   for (let item of dataMap.detailsForm) {
  //    var receivingNum = item.receivingNum
  //    if (receivingNum) {
  //   }
  // }
    dataMap.loading = true
    let userInfo = localStorage.getItem('userInfo')
    let text = eval('(' + userInfo + ')')
    let array: any[] = []
    dataMap.detailsForm.forEach((item: any) => {
      if(item.receivingNum){
        array.push({ poItemNo: item.poItemNo, materialID: item.materialID, receivingNum: item.receivingNum })
      }else{
        _showFailToast('请输入实收数量！') 
      }
    })
    let data = {
      po: form.value.purchaseOrder,
      wareHouseID:form.value.warehouse,
      receivingDate: form.value.date,
      locationsID: form.value.locID,
      supplierCode: dataMap.supplierCode,
      controlPeople: text.account,
      controlPeopleName: text.name,
      inputMaterial: array
    }
    WMSAPI.post(APIName, data, 'pda/ArriveMaterial').then((res) => {
      if (res && res.success) {
        dataMap.loading = false
        showSuccessToast(res.message as string)
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
      else {
         _showFailToast(res.message as string) 
        dataMap.loading = false }
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