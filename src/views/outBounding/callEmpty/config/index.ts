import { FormConfig, FormConfigText, TableColumn } from '@/typing'
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
export const formList: Array<FormConfig> = [
  { type: 'Select', label: '仓库', prop: 'warehouse', options:[],optionsTwo: [],apiParam:'warehouseID',
  rules: [{ required: true, message: '请选择仓库', trigger: 'onBlur' }]},
  { type: 'Select', label: '出库地点', prop: 'warehouse', options:[],optionsTwo: [],apiParam:'warehouseID',
  rules: [{ required: true, message: '请选择出库地点', trigger: 'onBlur' }]},
  {
    type: 'Number',
    label: '需求数量',
    prop: 'purchaseOrder',
    rules: [{ required: true, message: '请输入物料描述', trigger: 'onBlur' }]
  },
  {
    type: 'Message',
    label: '消息',
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
