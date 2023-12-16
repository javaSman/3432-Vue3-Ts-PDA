import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '行号',
    span: 8,
    prop: 'poItemNo'
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 16,
    prop: 'materialID'
  },
  {
    type: 'Text',
    label: '物料描述',
    span: 24,
    prop: 'materialDesc'
  },
  // {
  //   type: 'Text',
  //   label: '订单数量',
  //   span: 8,
  //   prop: 'quantity'
  // },
  {
    type: 'Select',
    label: '仓库',
    span: 12,
    prop: 'wareHouseID',
    options: [],
    optionsTwo: []
  },
  {
    type: 'Text',
    label: '未收数量',
    span: 12,
    prop: 'nomenge'
  },
  // {
  //   type: 'Input',
  //   label: '供应商批次',
  //   span: 13,
  //   prop: 'receivingNum',
  //   // rules: [{ required: true, message: '请输入实收数量', trigger: 'onBlur' }]
  // },
  // {
  //   type: 'Input',
  //   label: '实收',
  //   span: 9,
  //   prop: 'receivingNum',
  //   // rules: [{ required: true, message: '请输入实收数量', trigger: 'onBlur' }]
  // },
  // {
  //   type: 'plus',
  //   label: '',
  //   span: 1,
  //   prop: ''
  // },
  // {
  //   type: 'button',
  //   label: '',
  //   span: 24,
  //   prop: ''
  // },
  {
    type: 'MultiLine',
    label: '',
    span: 24,
    prop: 'multiLine'
    // supplierConfig: []
  }
]
export const formList: Array<FormConfig> = [
  // {
  //   type: 'Select',
  //   label: '仓库',
  //   prop: 'warehouse',
  //   options: [],
  //   optionsTwo: [],
  //   rules: [{ required: true, message: '请选择仓库', trigger: 'onBlur' }]
  // },
  {
    type: 'Input',
    label: '采购订单',
    prop: 'purchaseOrder',
    rules: [{ required: true, message: '请输入采购订单', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '供应商',
    prop: 'supplierName'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  // {
  //   type: 'Input',
  //   label: '货位编码',
  //   prop: 'locID',
  //   rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  // },
  {
    type: 'Input',
    label: '物料编码',
    prop: 'materialID',
    placeholder: '如果要过滤物料，请输入编码'
  },
  {
    type: 'Calendar',
    label: '收货日期',
    prop: 'date',
    rules: [{ required: true, message: '请选择收货日期', trigger: 'onBlur' }]
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message',
    rules: [{ required: true, message: '请输入物料描述', trigger: 'onBlur' }]
  }
]
// export const showFormList: Array<FormConfig> = [
//   { label: '送货条码', prop: 'delivnum', type: 'Text' },
//   { label: '送货单号', prop: 'sgtxt4', type: 'Text' },
//   { label: '供应商', prop: 'lifnr', type: 'Text' },
//   { label: '采购订单', prop: 'ebeln', type: 'Text' },
//   { label: '件数', prop: 'prtmg', type: 'Text' },
//   { label: '过账日期', prop: 'postDate', type: 'Calendar' }
// ]
export const tableColumn: TableColumn[] = [
  { label: '订单行', prop: 'ebelp', formatter: formatEbeln, type: 'Table/CheckBox' },
  { label: '目标库位', prop: 'lgort', formatter: formatLgort },
  { label: '物料编号', prop: 'idnrk', type: 'Table/RightBtn', tableBtnParams: { btnText: '配件清单', loading: [] } },
  { label: '物料描述', prop: 'txz01', type: 'Table/Notice' },
  { label: '收货数量', prop: 'erfmg', formatter: formatErfmgMultiple },
  { label: '生产批/工位', prop: 'charg', formatter: formatCharg },
  { label: 'ECN号', prop: 'zzngeln' }
]
