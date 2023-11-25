<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <!-- <van-action-bar>
    <van-action-bar-button type="default" text="清除" @click="handleClear" />
  </van-action-bar> -->
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
import { reactive, ref, onMounted, nextTick } from 'vue'
import { formList } from './config'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'
import { WMSAPI } from '@/api/generalAPI'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let boxInputRef: FieldInstance | null = null
const APIName = 'business'
let dataMap = reactive({
  formList,
  form: {} as any,
  boxIds: [] as any,
  loading: false,
  confirmText: '确定'
})
const form = ref({
  BoxID: '',
  message: ''
})
onMounted(() => {
  initConfig()
  // let BoxID = formComponent.value?.formInputRef.BoxID.inputRef
  // BoxID.focus()
  boxInputRef?.focus()
})
dataMap.formList[0].enter = getBoxID
function getBoxID() {
  dataMap.boxIds.push(form.value.BoxID)
  // boxInputRef?.focus()
  setTimeout(() => {
    if (boxInputRef) {
      boxInputRef?.focus()
      form.value.BoxID = ''
    }
  }, 0)
}
// 清除
function handleClear() {
  form.value = {
    BoxID: '',
    message: ''
  }
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    WMSAPI.post(APIName,  dataMap.boxIds , 'box/BoxClean').then((res) => {
      if (res.success == true) {
        dataMap.loading = false
        form.value.message = res.message as string
        form.value.BoxID = ''
      }else {
        form.value.message = res.message as string
      }
    })
  })
}
// 初始化配置项
function initConfig() {
  dataMap.formList.forEach((item) => {
    if (item.prop === 'BoxID') {
      boxInputRef = formComponent.value?.formInputRef[item.prop].inputRef
    }
  })
}
</script>
<style scoped>
/* .form {
  margin-top: 12px;
}
/deep/ .van-grid-item {
 font-size: 12px;
} */
.form {
  margin-top: 12px;
}
::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
</style>
