<template>
 <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
 <DetailsVue v-for="(item,index) in dataMap.detailsForm"  v-model:formData="dataMap.detailsForm[index]" :formList="dataMap.detailsList"></DetailsVue>
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
import { formList, detailsList, tableColumn } from './config'
import { WMSAPI } from '@/api/generalAPI'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'
import { showSuccessToast } from 'vant'
import { _showFailToast } from '@/utils/message'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
const APIName = 'business'
const form = ref(
  {
    boxID: '',
    warehouseID: '',
    inLocationID: '',
    outLocationID: '',
    message: ''
  })
let dataMap = reactive({
  list: [] as any[],
  formList,
  detailsList,
  form: {} as any,
  detailsForm: [] as any[],
  show: false,
  loading: false,
  confirmText: '确定'
})
onMounted(() => {
   getDict()
})
// 获取仓库
function getDict() {
  WMSAPI.get(APIName, {IsPage:false}, 'warehouse/all').then(res => {
    let array: any[] = []
    array = res.items as []
    array.forEach(item => {
          item.label = item.warehouseName
          item.value = item.warehouseID
        })
        dataMap.formList[3].options = array
        dataMap.formList[3].optionsTwo = array
  })
}
dataMap.formList[0].enter = getDetails
function getDetails() {
  WMSAPI.get(APIName, { boxID: form.value.boxID }, 'box/GetBoxInfo').then((res) => {
    if (res.success) {
      form.value.message = res.message as string
      form.value.outLocationID = res.data.box.locationID as string
      dataMap.detailsForm = res.data.details
    }
  })
}
dataMap.formList[2].enter = getLocations
function getLocations() {
  WMSAPI.get(APIName, { LocationID: form.value.inLocationID }, 'pda/GetLocationsInfo').then((res) => {
    if (res.success == true||res.success == false) {
      form.value.message = res.message as string
    }
  })
}
function handleClear() {
  form.value = {
    boxID: '',
    warehouseID: '',
    inLocationID: '',
    outLocationID: '',
    message: ''
  }
  dataMap.detailsForm = []
}
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    let data = {
      warehouseID: form.value.warehouseID,
      outLocationID: form.value.outLocationID,
      inLocationID: form.value.inLocationID,
      boxID: form.value.boxID
    }
    WMSAPI.post(APIName, data, 'pda/TransferLocation').then((res) => {
      if (res && res.success) {
        dataMap.loading = false
        form.value.message = res.message as string
        form.value = {
          boxID: '',
          warehouseID: '',
          inLocationID: '',
          outLocationID: '',
          message: ''
        }
        dataMap.detailsForm = []
      }
      else {
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
</style>