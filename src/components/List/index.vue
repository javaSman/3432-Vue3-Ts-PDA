<template>
    <van-form ref="listForm" :label-width="labelWidth">
        <van-cell-group :inset="inset">
            <div class="content">
                <van-row class="title-content">
                    <van-col :span="22">
                        <van-field class="title">
                            <template #input>
                                {{ listTitle }}
                            </template>
                        </van-field>
                    </van-col>
                    <van-col :span="2">
                        <div class="round">{{ index + 1 }}</div>
                    </van-col>
                </van-row>
                <van-row v-show="field">
                    <van-col v-for="item in formListFiter" :key="item.prop" :span="item.span">
                        <van-field v-if="item.type === 'Text'" :name="item.prop" :label="item.label" :label-width="60">
                            <template #input>
                                {{ form[item.prop] }}
                            </template>
                        </van-field>
                        <InputVue :ref="(el: any) => formInputRef[item.prop] = el"
                            v-if="item.type === 'Input' || item.type === 'Textarea'" v-model="form[item.prop]" :item="item"
                            :isEdit="isEdit" />
                            <van-notice-bar  v-if="item.type === 'Notice'" scrollable>{{ form[item.prop] }}</van-notice-bar>
                    </van-col>
                    <van-col :span="2">
                        <van-icon class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" />
                    </van-col>
                </van-row>
            </div>
        </van-cell-group>
        <!-- </template> -->
        <!-- 隐藏字段布局 -->
        <div class="showContent">
            <van-cell-group v-show="show">
                <DetailVue v-show="show" ref="showFormComponent" :form-data.sync="showForm" :formList="showFormList" />
            </van-cell-group>
            <van-cell-group v-show="field == false">
                <DetailVue v-show="field == false" ref="showFormComponent" :form-data.sync="showForm" :formList="showFormList" />
            </van-cell-group>
        </div>
        <!-- <van-cell-group :inset="inset">
            <div>
                <van-row>
                    <van-col v-for="item in formListFiter" :key="item.prop" :span="item.span">
                        <van-field v-if="item.type === 'Text'" :name="item.prop" :label="item.label">
                            <template #input>
                                {{ form[item.prop] }}
                            </template>
                        </van-field>
                        <InputVue :ref="(el: any) => formInputRef[item.prop] = el"
                            v-if="item.type === 'Input' || item.type === 'Textarea'" v-model="form[item.prop]" :item="item"
                            :isEdit="isEdit" />
                    </van-col>
                </van-row>
            </div>
        </van-cell-group> -->
    </van-form>
</template>
<script lang="ts" setup name="listVue">
import { FormConfigText, FormConfig } from '@/typing'
import { PropType, computed, ref } from 'vue'
import InputVue from '@/components/Input/Input.vue'
import DetailVue from '@/components/Details/index.vue'
import { Form, Cell } from 'vant'
let props = defineProps({
    index: { type: Number, default: 0 }, // 信息条目索引
    labelWidth: { type: Number, default: 80 }, // label 的宽度
    layout: { type: Number, default: 12 }, // label 的宽度
    inset: { type: Boolean, default: false },
    field: { type: Boolean, default: false }, // 明细点击箭头展开
    listTitle: { type: String, default: '' },
    listData: { type: Array, default: () => [] }, // 信息数据组
    formData: { type: Object as PropType<any>, default: () => ({}) }, // 要清空的表单对象
    formList: { type: Array as PropType<FormConfigText[]>, default: () => [] }, // 表单字段参数
    showForm: { type: Object as PropType<any>, default: () => ({}) }, // 要清空的展开数据对象
    showFormList: { type: Array as PropType<FormConfigText[]>, default: () => [] }, // 需要展开显示的数据字段参数
    isEdit: { type: Boolean, default: true },
    submit: {
        type: Function,
        default: () => {
            return false
        }
    }
})
// 点击左侧箭头是否展开
let show = ref(false)
let formInputRef = ref<any>({})
let detailForm = ref(Form)
let emits = defineEmits(['update:formData', 'onSubmit', 'onDropdown'])
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
</script>
<style scoped>
/deep/ .van-col {
    border-bottom: 1px solid rgb(238, 238, 238);
}

/deep/ .van-form {
    margin: 0px auto;
}

/deep/ .van-cell {
    font-size: 12px;
    font-weight: 400;
}

.title {
    font-size: 12px;
    font-weight: 700;
    line-height: 40px;
}

.round {
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin: 8px auto;
    border-radius: 50%;
    border: 2px solid rgb(0, 0, 0);
}

.icon {
    line-height: 40px;
}
.title-content{
    padding: 0 12px;
}
::v-deep .van-cell {
 padding: 0px 12px;
}
::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
</style>