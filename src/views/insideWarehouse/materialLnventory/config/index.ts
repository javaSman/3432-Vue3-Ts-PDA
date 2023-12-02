import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '物料条码',
    span: 24,
    prop: 'materialID'
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 24,
    prop: 'materialDesc'
  },
  {
    type: 'Text',
    label: '物料描述',
    span: 24,
    prop: 'materialDesc'
  },
  {
    type: 'Text',
    label: '载具编码',
    span: 24,
    prop: 'materialDesc'
  },
  {
    type: 'Text',
    label: '货位编码',
    span: 24,
    prop: 'materialDesc'
  },
  {
    type: 'Text',
    label: '质检结果',
    span: 24,
    prop: 'materialDesc'
  }
]
export const formList: Array<FormConfigText> = [
  // {
  //   type: 'Calendar',
  //   label: '收货日期',
  //   prop: 'imBarcode',
  //   rules: [{ required: true, message: '请选择收货日期', trigger: 'onBlur' }]
  // },
  {
    type: 'Input',
    label: '盘点单',
    prop: 'purchaseOrder',
    span: 24,
    rules: [{ required: true, message: '请输入采购订单', trigger: 'onBlur' }]
  },
   {
    type: 'Select',
    label: '仓库',
    prop: 'warehouse',
    span: 20,
    options: [],
    optionsTwo: []
  },
  {
    type: 'Ischecked',
    label: '盲盘',
    prop: 'hideBox',
    span: 4
  },
  {
    type: 'Text',
    label: '需盘标签个数:',
    prop: 'imBarcode',
    span: 12
  },
  {
    type: 'Text',
    label: '已盘标签个数:',
    prop: 'imBarcode',
    span: 12
  },
  // {
  //   type: 'Text',
  //   label: '待盘标签个数:',
  //   prop: 'imBarcode',
  //   span: 8
  // },
  {
    type: 'Input',
    label: '标签条码',
    prop: 'imBarcode',
    span: 24,
    rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '实盘数量',
    prop: 'realNum',
    span: 16
  },
  {
    type: 'IsUnit',
    label: '单位',
    prop: 'unit',
    span: 8
  },
  {
    type: 'Message',
    label: '消息',
    prop: 'message',
    span: 24
  }
]
export const showFormList: Array<FormConfigText> = [
  { label: '批次号', prop: 'batch', type: 'Text', span: 24 },
  { label: '转库单行号', prop: 'allocationNo', type: 'Text',span: 24 },
  { label: '转库单数量', prop: 'quantity', type: 'Text',span: 24 },
  { label: '供应商代码', prop: 'supplierCode', type: 'Text',span: 24 },
  { label: '已转数量', prop: 'pickQuantity', type: 'Text',span: 24 },
  { label: '已转标签集', prop: 'pickBarcodes', type: 'Text',span: 24 }
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
