import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '物料编码',
    span: 24,
    prop: 'materialID'
  },
  {
    type: 'Text',
    label: '物料描述',
    span: 22,
    prop: 'materialDesc'
  }
]
export const formList: Array<FormConfig> = [
  // {
  //   type: 'Calendar',
  //   label: '收货日期',
  //   prop: 'imBarcode',
  //   rules: [{ required: true, message: '请选择收货日期', trigger: 'onBlur' }]
  // },
  {
    type: 'Input',
    label: '调拨单',
    prop: 'purchaseOrder',
    rules: [{ required: true, message: '请输入调拨单', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '转入载具',
    prop: 'boxId',
    rules: [{ required: true, message: '请输入转入载具', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '转入货位',
    prop: 'locationId',
    rules: [{ required: true, message: '请输入转入货位', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '标签条码',
    prop: 'imBarcode',
    rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message'
  }
]
export const showFormList: Array<FormConfigText> = [
  { label: '批次号', prop: 'batch', type: 'Text', span: 24 },
  { label: '调拨单行号', prop: 'allocationNo', type: 'Text', span: 24 },
  { label: '调拨单数量', prop: 'quantity', type: 'Text', span: 24 },
  { label: '供应商代码', prop: 'supplierCode', type: 'Text', span: 24 },
  { label: '已转数量', prop: 'pickQuantity', type: 'Text', span: 24 },
  { label: '已转标签集', prop: 'pickBarcodes', type: 'Text', span: 24 }
]
export const tableColumn: TableColumn[] = [
  { label: '订单行', prop: 'ebelp', formatter: formatEbeln, type: 'Table/CheckBox' },
  { label: '目标库位', prop: 'lgort', formatter: formatLgort },
  { label: '物料编号', prop: 'idnrk', type: 'Table/RightBtn', tableBtnParams: { btnText: '配件清单', loading: [] } },
  { label: '物料描述', prop: 'txz01', type: 'Table/Notice' },
  { label: '收货数量', prop: 'erfmg', formatter: formatErfmgMultiple },
  { label: '生产批/工位', prop: 'charg', formatter: formatCharg },
  { label: 'ECN号', prop: 'zzngeln' }
]
