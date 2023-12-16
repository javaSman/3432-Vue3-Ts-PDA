import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '单号:',
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
    label: '物料描述',
    span: 24,
    prop: 'materialDesc'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  // {
  //   type: 'Text',
  //   label: '订单数量',
  //   span: 8,
  //   prop: 'imBarcode'
  // },
  // {
  //   type: 'Text',
  //   label: '已收数量',
  //   span: 8,
  //   prop: 'imBarcode'
  // },
  // {
  //   type: 'Text',
  //   label: '未收数量',
  //   span: 8,
  //   prop: 'imBarcode'
  // },
  {
    type: 'Text',
    label: '扫描进度',
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
    type: 'Select',
    label: '仓库',
    prop: 'warehouseID',
    options: [],
    optionsTwo: [],
    rules: [{ required: true, message: '请选择仓库', trigger: 'onBlur' }]
  },
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
  // {
  //   type: 'Input',
  //   label: '供应商',
  //   prop: 'imBarcode'
  //   // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  // },

  {
    type: 'Input',
    label: '标签条码',
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入标签条码', trigger: 'onBlur' }]
  },
  {
    type: 'Calendar',
    label: '过账日期',
    prop: 'date',
    rules: [{ required: true, message: '请选择过账日期', trigger: 'onBlur' }]
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
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
