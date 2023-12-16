import { FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '物料条码',
    span: 24,
    prop: 'imBarcode',
    rules: [{ required: true, message: '请选择收货日期', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 24,
    prop: 'purchaseOrder',
    rules: [{ required: true, message: '请输入采购订单', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '物料名称',
    span: 24,
    prop: 'imBarcode'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '批次',
    span: 24,
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '供应商编号',
    span: 24,
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入物料描述', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '供应商名称',
    span: 24,
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入物料描述', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '单位',
    span: 24,
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入物料描述', trigger: 'onBlur' }]
  }
]
export const formList: Array<FormConfigText> = [
  {
    type: 'Input',
    label: '原标签',
    span: 24,
    prop: 'barcode',
    rules: [{ required: true, message: '请输入原标签', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '原数量',
    span: 12,
    prop: 'quantity'
  },
  {
    type: 'Text',
    label: '剩余数量',
    span: 12,
    prop: 'remainQuantity'
  },
  {
    type: 'Number',
    label: '拆出数量',
    span: 24,
    prop: 'spliceQuantity'
  },
  {
    type: 'Number',
    label: '标签个数',
    span: 24,
    prop: 'share'
  },
  {
    type: 'Message',
    label: '消息',
    span: 24,
    prop: 'message'
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
