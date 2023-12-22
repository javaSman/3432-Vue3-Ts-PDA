<template>
  <div>
    <van-field
      v-model="label"
      readonly
      :name="item.prop"
      :label="item.label"
      :required="item.rules && item.rules.length > 0"
      is-link
      @click="showPicker = true"
    />
    <van-popup
      v-model:show="showPicker"
      position="top"
      get-container="body"
      :style="{ height: '100%' }"
      class="flex-container"
    >
      <!-- <van-picker v-model="selected" :columns="item.options" :columns-field-names="customFieldName" @confirm="confirm" @cancel="showPicker = false" /> -->
      <van-search
        class="flex-header"
        v-model="value"
        shape="round"
        show-action
        @search="onSearch(value)"
        @input="onInput(value)"
        @cancel="showPicker = false"
        placeholder="请输入搜索关键词"
      />

      <van-radio-group
        v-model="fieldValue"
        class="radio-group flex-main"
        @change="item.change ? item.change(label) : ''"
      >
        <van-cell-group>
          <van-list v-model="listLoading" :finished="listFinished" finished-text="没有更多了">
            <van-cell
              v-for="radio in item.options"
              :key="radio.value"
              :title="radio.label"
              clickable
              @click="onClick(radio)"
            >
              <template #default>
                <span class="text">{{ radio.value }}</span>
              </template>
              <template #right-icon>
                <van-radio :name="radio.value">
                  <template #icon="props">
                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                  </template>
                </van-radio>
              </template>
            </van-cell>
            <!-- <van-cell title="单选框 2" clickable>
        <template #default>
                <span class="text"> 1111 </span>
              </template>
        <template #right-icon>
        <van-radio name="2">
          <template #icon="props">
            <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
          </template>
        </van-radio>
        </template>
      </van-cell> -->
          </van-list>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<script lang="ts" setup name="SelectVue">
import { FormConfig, IDictObj } from '@/typing'
import { PickerConfirmEventParams, RadioGroup, Radio, showToast } from 'vant'
import { PropType, computed, ref, onMounted, reactive } from 'vue'
import { Vue } from 'vue-demi'

let emits = defineEmits(['update:modelValue', 'blur', 'enter', 'onSearch'])
let props = defineProps({
  modelValue: { type: [String, Number], default: () => '' }, // 表单的v-model
  item: { type: Object as PropType<FormConfig>, default: () => ({}) },
  isEdit: { type: Boolean, default: () => false }
})
let dataMap = reactive({
  optionsClone: JSON.parse(JSON.stringify(props.item.options))
})
onMounted(() => {})
let showPicker = ref<boolean>(false)
/** 表单值，val */
let fieldValue = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val)
})
// label显示文字的值
let label = computed({
  get: () => {
    if (props.modelValue) {
      let text = ''
      let array = props.item.options as []
      array.forEach((item: any) => {
        if (props.modelValue === item.value) {
          text = item.label
        }
      })
      return text
    } else return ''
  },
  set: (val) => val
})
let selected = computed({
  get: () => (props.modelValue ? [props.modelValue] : []),
  set: (val) => val
})
// let radio = computed({
//   get: () => props.modelValue,
//   set: (val) => val
// })
const listLoading = ref(false)
const listFinished = ref(false)
// 单选框数组
// const options = ref([{label:'101层',value:'101'},{label:'102层',value:'102'},{label:'103层',value:'103'},{label:'104层',value:'104'}])
// 单选宽选中与未选中图标
const activeIcon = ref(require('../../assets/images/activeIcon.png'))
const inactiveIcon = ref(require('../../assets/images/inactiveIcon.png'))
// 搜索值
// const label = ref('')
const value = ref('')
let apiParam = props.item.apiParam
// console.log(typeof (apiParam))
let search = ref('')
let listQuery = ref({ SkipCount: 0, MaxResultCount: 20 })
// const onSearch = (val: string) => {
// search = ref(val)

// };
function onInput(value: string) {
  onSearch(value)
}
function onSearch(value: string) {
  // emits('onSearch',value)
  if (value) {
    let data = props.item.options?.filter((item) => {
      let reg = new RegExp(value) // 正则模糊搜索
      return reg.test(item.label) || reg.test(item.value)
    })
    props.item.options = data
  } else {
    props.item.options = props.item.optionsTwo
  }
  // console.log(props.item.options,'12344')
}
const onCancel = () => {
  showPicker = ref(false)
  props.item.options = props.item.options
}
let customFieldName = computed(() => {
  let opt: IDictObj | undefined = props.item.optProps
  if (!opt) return { text: 'text', value: 'value' }
  else return { text: opt.label, value: opt.value }
})
function onClick(radio: any) {
  // console.log(radio,'radio')
  showPicker.value = false
  fieldValue.value = radio.value
  label.value = radio.label
  radio.value = radio.value
}
// function confirm({ selectedValues, selectedOptions, selectedIndexes }: PickerConfirmEventParams) {
//   // console.log(selectedValues, selectedOptions, selectedIndexes)
//   showPicker.value = false
//   label.value = (selectedOptions[0] as any)[customFieldName.value.text]
//   fieldValue.value = selectedValues[0]
//   props.item.change && props.item.change(selectedValues[0])
// }
</script>
<style scoped lang="scss">
.flex-container {
  display: flex; // 父元素的定义为flex布局
  flex-direction: column; // 定义排列方向为竖排
  width: 100%;
  height: 100%;

  .flex-header {
    height: 55px;
  }

  .flex-main {
    flex: 1;
    overflow: auto;
  }
}

.radio-group {
  overflow-y: auto;
}

.img-icon {
  width: 12px;
  height: 12px;
  padding-left: 15px;
}

:deep(.van-cell__value) {
  text-align: right;
}
</style>
