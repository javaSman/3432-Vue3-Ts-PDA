import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '载具编码',
    span: 24,
    prop: 'boxID'
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 24,
    prop: 'materialID',
  },
  {
    type: 'Text',
    label: '物料名称',
    span: 24,
    prop: 'materialDesc'
  },
  {
    type: 'Text',
    label: '物料数量',
    span: 24,
    prop: 'quantity'
  },
  {
    type: 'Text',
    label: '批次',
    span: 24,
    prop: 'batchID'
  }
]
export const formList: Array<FormConfig> = [
  {
    type: 'Input',
    label: '载具编码',
    prop: 'boxID',
    rules: [{ required: true, message: '请输入载具编码', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '转出货位',
    prop: 'outLocationID',
    rules: [{ required: true, message: '请输入转出货位', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '转入货位',
    prop: 'inLocationID',
    rules: [{ required: true, message: '请输入转入货位', trigger: 'onBlur' }]
  },
  {
    type: 'Select',
    label: '仓库',
    prop: 'warehouseID',
    options: [],
    optionsTwo: [],
    rules: [{ required: true, message: '请选择仓库', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '消息',
    prop: 'message'
  },
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
