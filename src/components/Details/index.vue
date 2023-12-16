<template>
  <van-form ref="detailForm" :label-width="labelWidth">
    <van-cell-group :inset="inset">
      <van-cell>
        <!-- <div> -->
        <van-row>
          <van-col v-for="item in formListFiter" :key="item.prop" :span="item.span">
            <van-field v-if="item.type === 'Text'" :name="item.prop" :label="item.label">
              <template #input>
                {{ form[item.prop] }}
              </template>
            </van-field>
            <InputVue
              :ref="(el: any) => formInputRef[item.prop] = el"
              v-if="item.type === 'Input' || item.type === 'Textarea'"
              v-model="form[item.prop]"
              :item="item"
              :isEdit="isEdit"
            />
            <SelectVue v-if="item.type === 'Select'" v-model="form[item.prop]" :item="item" :isEdit="isEdit" />
            <!-- <MultiLineVue v-if="item.type === 'MultiLine'" v-model="form[item.prop]" :supplierConfig="item.supplierConfig"></MultiLineVue> -->
            <MultiLineVue
              :key="index"
              v-if="item.type === 'MultiLine'"
              :supplierIndex="index"
              :detailsForm="detailsForm"
              :supplierConfig="supplierConfig"
            />
            <div v-if="item.type === 'button'">
              <van-button type="primary" size="mini" @click="supplierList">供应商批次</van-button>
            </div>
            <!-- <van-icon v-if="item.type === 'plus'" class="icon" name="plus" @click="" />
                            <van-icon v-if="item.type === 'minus'" class="icon" name="minus" @click="" /> -->
            <!-- <van-field v-if="item.type === 'Content'" :name="item.prop" :label="item.label" @click="contentDetails">
                            <template #input>
                                {{ form[item.prop] }}
                            </template>
                        </van-field> -->
          </van-col>
          <!-- <van-col span="12">
                        <van-field v-if="item.type === 'Text'" :name="item.prop" :label="item.label">
                            <template #input>
                                {{ form[item.prop] }}
                            </template>
                        </van-field>
                    </van-col> -->
        </van-row>
        <!-- <van-row>
                    <van-col span="12">
                        <van-field v-if="item.type === 'Text'" :name="item.prop" :label="item.label">
                            <template #input>
                                {{ form[item.prop] }}
                            </template>
                        </van-field>
                    </van-col>
                </van-row> -->
        <!-- </div> -->
      </van-cell>
    </van-cell-group>
  </van-form>
</template>
<script lang="ts" setup name="detailVue">
import { FormConfigText } from '@/typing'
import { PropType, computed, ref, reactive, defineEmits } from 'vue'
import InputVue from '@/components/Input/Input.vue'
import SelectVue from '@/components/Select/Select.vue'
import MultiLineVue from '@/components/MultiLine/index.vue'
import { Form } from 'vant'
let props = defineProps({
  index: { type: Number, default: 0 }, // 信息条目索引
  labelWidth: { type: Number, default: 80 }, // label 的宽度
  layout: { type: Number, default: 12 }, // label 的宽度
  inset: { type: Boolean, default: false },
  formData: { type: Object as PropType<any>, default: () => ({}) }, // 要清空的表单对象
  formList: { type: Array as PropType<FormConfigText[]>, default: () => [] }, // 表单字段参数
  isEdit: { type: Boolean, default: true },
  supplierConfig: { type: Array, default: [] },
  detailsForm: { type: Array, default: [] },
  submit: {
    type: Function,
    default: () => {
      return false
    }
  }
})
const state = reactive({
  ruleForm: {
    supplierConfig: [
      {
        supplierBatch: '',
        receivingNum: ''
      }
    ]
  }
})
let formInputRef = ref<any>({})
let detailForm = ref(Form)
let emits = defineEmits(['update:formData', 'onSubmit', 'onDropdown', 'supplierList'])
let form = computed({
  get: () => props.formData,
  set: (val) => emits('update:formData', val)
})
/** 表单条目-过滤hide隐藏的条目 */
let formListFiter = computed<FormConfigText[]>(() => {
  let arr: Array<FormConfigText> = []
  arr = props.formList.filter((item: FormConfigText) => !item.isHide)
  return arr
})
function supplierList() {
  emits('supplierList')
}
</script>
<style scoped>
::deep .van-col {
  border-bottom: 1px solid rgb(238, 238, 238);
}
/* /deep/ .van-cell {
   background: #D9F7BE;
   height: 40px;
} */
</style>
