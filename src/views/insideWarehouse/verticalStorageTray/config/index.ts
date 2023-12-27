import { FormConfig } from '@/typing'

export const formList: Array<FormConfig> = [
  {
    type: 'Select',
    label: '绑定类型',
    prop: 'materialsID',
    options: [],
    rules: [{ required: true, message: '请选择绑定类型', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '立库托盘',
    prop: 'boxID',
    rules: [{ required: true, message: '请输入立库托盘', trigger: 'onBlur' }]
  },
  {
    type: 'Number',
    label: '空托数量',
    prop: 'quantity'
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message'
  }
]
