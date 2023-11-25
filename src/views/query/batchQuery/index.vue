<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <ListVue v-for="(item, index) in dataMap.data.tableData" :listTitle="dataMap.listTitle" :field="false" :showForm="item" :showFormList="dataMap.showFormList" :index="index">
  </ListVue>
  <!-- <van-action-bar>
    <van-action-bar-button type="default" text="清除" @click="handleClear" />
  </van-action-bar> -->
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
import FormVue from '../../../components/Form/index.vue'
import ListVue from '../../../components/List/index.vue'
import ActionBarVue from '../../businessComponents/ActionBar.vue'
import { reactive, ref } from 'vue'
import { formList, detailsList, showFormList, tableColumn } from './config'
import { WMSAPI } from '@/api/generalAPI'
const APIName = 'business'
let dataMap = reactive({
  list: [] as any[],
  formList,
  showFormList,
  detailsList,
  form: {} as any,
  showData: {} as any,
  detailsForm: {} as any,
  data:{
  boxIn: '1001',
  boxOut: '1002',
  transferNum: 4,
  transferNum2: 0,
  transferNum3: 0,
  transferNum4: 0,
  tableData: []
  },
  show: false,
  loading: false,
  listTitle: '批次物料',
  confirmText: '确定'
})
const form = ref(
  {
    batch: '',
    message: ''
  })
dataMap.formList[0].enter = getDetails
// 批次查询
function getDetails() {
  // dataMap.show = true
  WMSAPI.get(APIName, { Batch: form.value.batch }, 'pda/GetBoxMaterialByBatch').then((res) => {
    if (res.success) {
    dataMap.data.tableData = res.datas as []
    form.value.message = res.message as string
  }else {
    form.value.message = res.message as string
  }
  })
}
// 清除
function handleClear() {
  form.value = {
    batch: '',
    message: ''
  }
  dataMap.data.tableData = []
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