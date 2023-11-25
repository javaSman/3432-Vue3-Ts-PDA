import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Text',
    label: '行号',
    span: 11,
    prop: 'date',
    rules: [{ required: true, message: '请选择收货日期', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '物料编码',
    span: 11,
    prop: 'name',
    rules: [{ required: true, message: '请输入采购订单', trigger: 'onBlur' }]
  }
]
export const formList: Array<FormConfig> = [
  {
    type: 'Input',
    label: '载具编码',
    prop: 'BoxID',
    // rules: [{ required: true, message: '请输入物料编码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
    label: '消息',
    prop: 'message'
  }
]
export const showFormList: Array<FormConfigText> = [
  { label: '仓库编码', prop: 'warehouseID', type: 'Text', span: 24 },
  { label: '物料编码', prop: 'materialID', type: 'Text',span: 24 },
  { label: '物料描述', prop: 'materialDesc', type: 'Text',span: 24 },
  { label: '物料数量', prop: 'quantity', type: 'Text',span: 24 },
  { label: '载具编号', prop: 'boxID', type: 'Text',span: 24 },
  { label: '货位编码', prop: 'locationID', type: 'Text',span: 24 }
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
