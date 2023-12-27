<template>
  <FormVue class="form" ref="formComponent" v-model:formData="dataMap.form" :formList="dataMap.formList" />
  <ActionBarVue
    ref="actionBarVue"
    :loading="dataMap.loading"
    :confirmText="dataMap.confirmText"
    @clear="handleClear"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts">
// 立库托盘绑定
const cachedName = 'insideWarehouse.verticalStorageTray'
export default {
  name: cachedName
}
</script>
<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import { reactive, ref, onMounted } from 'vue'
import { formList } from './config'
import { WMSAPI } from '@/api/generalAPI'
import { FieldInstance } from 'vant'
// import { _showFailToast } from '@/utils/message'
let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let boxInputRef: FieldInstance | null = null
const APIName = 'business'
let dataMap = reactive({
  formList,
  form: {} as any,
  loading: false,
  confirmText: '确定'
})
onMounted(() => {
  initConfig()
  getDict()
  boxInputRef?.focus()
})
// 清除
function handleClear() {
  dataMap.form = {
    boxID: '',
    quantity: '',
    materialsID: '',
    message: ''
  }
}
// 确定
function handleConfirm() {
  formComponent.value?.refForm.validate().then(() => {
    dataMap.loading = true
    if (dataMap.form.materialsID !== 'A202312220004' && dataMap.form.quantity) {
      delete dataMap.form.quantity
    }
    WMSAPI.post(APIName, dataMap.form, 'pda/OtherBinding').then((res: any) => {
      if (res.success) {
        dataMap.loading = false
        dataMap.form = {
          boxID: '',
          quantity: '',
          materialsID: ''
        }
        dataMap.form.message = '操作成功'
        // _showFailToast('操作成功')
      } else {
        dataMap.loading = false
        dataMap.form.message = res.message
        // _showFailToast(res.message)
      }
    })
  })
}
// 获取绑定类型
function getDict() {
  WMSAPI.getDict('business/dict', { name: 'InMaterials' }).then((res) => {
    dataMap.formList[0].options = res.details
  })
}
dataMap.formList[1].enter = () => {
  dataMap.form.message = `托盘【${dataMap.form.boxID}】扫描成功`
}

// 初始化配置项
function initConfig() {
  dataMap.form.quantity = 1
  dataMap.formList.forEach((item) => {
    if (item.prop === 'boxID') {
      boxInputRef = formComponent.value?.formInputRef[item.prop].inputRef
      boxInputRef?.focus()
    }
    // if (item.prop === 'materialsID') {
    //   item.change = (row) => {
    //     if (row === '立库空托') {

    //     } else {
    //     }
    //   }
    // }
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
