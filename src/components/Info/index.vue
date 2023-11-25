s<template>
  <div class="content">
    <van-row :style="{ background: list.rate == 100 ? '#D9F7BE' : '#ffffff' }">
      <van-col span="6">行号:{{ list.pickItemNo }}</van-col>
      <van-col span="11" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
        <!-- <van-notice-bar
          :scrollable="true"
          class="notice"
          :style="{ background: list.rate == 100 ? '#D9F7BE' : '#ffffff' }"
          :text="'物料描述:' + list.materialDesc"
        ></van-notice-bar> -->
        物料描述:{{ list.materialDesc }}
      </van-col>
      <van-col span="1"><van-icon class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" /></van-col>
        <!-- <van-collapse-item title="标题1" name="1">代码是写出来给人看的，附带能在机器上运行。</van-collapse-item> -->
      <van-col span="6">进度:{{ list.rate }}</van-col>
    </van-row>
    <div class="" v-show="show" style="width:100%;height:auto;">
      物料描述:{{ list.materialDesc }}
    </div>
  </div>
</template>
<script lang="ts" setup name="infoVue">
import { FormConfigText } from '@/typing'
import { PropType, computed, ref, watch } from 'vue'
import InputVue from '@/components/Input/Input.vue'
import { Form, listProps } from 'vant'
let props = defineProps({
  labelWidth: { type: Number, default: 80 }, // label 的宽度
  layout: { type: Number, default: 12 }, // label 的宽度
  inset: { type: Boolean, default: false },
  formData: { type: Object as PropType<any>, default: () => ({}) }, // 要清空的表单对象
  formList: { type: Array as PropType<FormConfigText[]>, default: () => [] }, // 表单字段参数
  list: { type: Object, default: () => {} },
  materialDesc: { type: String, default: () => '' },
  isEdit: { type: Boolean, default: true }
  //   isShowNotice: { type: Boolean, default: true }
  // color: {
  //     type: String,
  //     default: () => {
  //         return ''
  //     }
  // }
})
// let isShowNotice = ref(true)
// let materialDesc = ref('')
let show = ref(false)
let formInputRef = ref<any>({})
let detailForm = ref(Form)
let emits = defineEmits(['update:formData', 'onSubmit', 'onDropdown'])
let form = computed({
  get: () => props.formData,
  set: (val) => emits('update:formData', val)
})
// console.log(isShowNotice)
// watch(isShowNotice, (newValue, oldValue) => {
//     console.log(newValue,oldValue)
//   if (newValue) {
//     debugger
//     console.log(`我侦听到了count状态的变化，当前值为${newValue},从而处理相关逻辑`)
//     nextTick(() => {
//       materialDesc.value = 'wffbvb'
//     })
//   } else {
//     materialDesc.value = '好不好'
//   }
// })
/** 表单条目-过滤hide隐藏的条目 */
let formListFiter = computed<FormConfigText[]>(() => {
  let arr: Array<FormConfigText> = []
  arr = props.formList.filter((item: FormConfigText) => !item.isHide)
  return arr
})
function color() {
  debugger
  console.log(props.list)
  if (props.list.schedule == 100) {
    debugger
    return 'background:#D9F7BE'
  } else {
    return 'background:#ffffff'
  }
}
</script>
<style scoped>
/* /deep/ .van-col {
    border-bottom: 1px solid rgb(238, 238, 238);
} */
:deep(.van-row) {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
}
.content {
  width: 95%;
  margin: 0 auto;
  background: #ffffff;
}
:deep(.van-notice-bar) {
  color: #000;
  background-color: #fff;
}
/* /deep/ .van-cell {
   background: #D9F7BE;
   height: 40px;
} */
</style>
