<template>
 <FormVue class="form" ref="formComponent" v-model:formData="dataMap.form" :formList="dataMap.formList" />
 <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" v-show="dataMap.show"></DetailsVue>
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
import { WMSAPI } from '@/api/generalAPI'
import { reactive, onMounted } from 'vue'
import { formList, detailsList, tableColumn } from './config'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'

let dataMap = reactive({
  list: [] as any[],
  formList,
  detailsList,
  form: {} as any,
  detailsForm: {} as any,
  show: false,
  loading: false,
  confirmText: '确定'
})
const APIName = 'business'
onMounted(() => {
   getDict()
   dataMap.formList[1].options = [{ label: '成品东侧3楼入库扫码', value: '101' },{ label: '成品西侧2楼入库扫码', value: '102' },{ label: '成品西侧3楼入库A扫码', value: '103' },{ label: '成品西侧3楼入库B扫码', value: '104' }]
   dataMap.formList[1].optionsTwo = [{ label: '成品东侧3楼入库扫码', value: '101' },{ label: '成品西侧2楼入库扫码', value: '102' },{ label: '成品西侧3楼入库A扫码', value: '103' },{ label: '成品西侧3楼入库B扫码', value: '104' }]
})
// dataMap.formList[0].options = [{ label: '01层', value: '01' },{ label: '02层', value: '02' },{ label: '03层', value: '03' },{ label: '04层', value: '04' }]
dataMap.formList[1].enter = getDetails
function getDetails() {
  dataMap.show = true
}
// 获取仓库
function getDict() {
  WMSAPI.get(APIName, {IsPage:false}, 'warehouse/all').then(res => {
    let array: any[] = []
    array = res.items as []
    array.forEach(item => {
          item.label = item.warehouseName
          item.value = item.warehouseID
        })
        dataMap.formList[0].options = array
        dataMap.formList[0].optionsTwo = JSON.parse(JSON.stringify(array))
  })
}
// 清除
function handleClear() {
  dataMap.form = {}
}
</script>
