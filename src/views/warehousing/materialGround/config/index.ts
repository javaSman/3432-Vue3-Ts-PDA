import { FormConfig, FormConfigText } from '@/typing'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '收货单号:',
    span: 16,
    prop: 'receiptID'
  },
  {
    type: 'Text',
    label: '行号:',
    span: 8,
    prop: 'receiptItemNo'
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 24,
    prop: 'materialID'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '物料描述',
    span: 24,
    prop: 'materialDesc'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '入库进度',
    span: 24,
    prop: 'rate'
  },
  {
    type: 'Text',
    label: '本次已扫',
    span: 24,
    prop: 'num'
  }
]
export const formList: Array<FormConfig> = [
  {
    type: 'Input',
    label: '标签条码',
    prop: 'imBarcode'
    // rules: [{ required: true, message: '请输入标签条码', trigger: 'onBlur' }]
  },
  {
    type: 'Select',
    label: '仓库',
    prop: 'warehouseID',
    options: [],
    optionsTwo: [],
    rules: [{ required: true, message: '请选择仓库', trigger: 'onBlur' }]
  },
  // {
  //   type: 'Input',
  //   label: '供应商',
  //   prop: 'imBarcode'
  //   // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  // },
  {
    type: 'Input',
    label: '载具编码',
    prop: 'boxId',
    rules: [{ required: true, message: '请输入载具编码', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '货位编码',
    prop: 'locationId',
    rules: [{ required: true, message: '请输入货位编码', trigger: 'onBlur' }]
  },
  {
    type: 'Calendar',
    label: '过账日期',
    prop: 'date',
    isHide: true,
    rules: [{ required: true, message: '请选择过账日期', trigger: 'onBlur' }]
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  }
]
