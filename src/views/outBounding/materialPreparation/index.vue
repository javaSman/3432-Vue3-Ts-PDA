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
import { reactive } from 'vue'
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
dataMap.formList[0].enter = getDetails
function getDetails() {
  dataMap.show = true
}
</script>
