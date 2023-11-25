import { FormConfig, FormConfigText, TableColumn } from '@/typing'
import { formatCharg, formatLgort, formatErfmgMultiple, formatEbeln } from '@/views/dict'

export const detailsList: Array<FormConfigText> = [
  {
    type: 'Input',
    label: '物料编码',
    span: 24,
    prop: 'poItemNo',
    rules: [{ required: true, message: '请输入物料编码', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '产品名称',
    span: 24,
    prop: 'materialID',
    rules: [{ required: true, message: '请输入产品名称', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '工单号',
    span: 12,
    prop: 'materialDesc',
    rules: [{ required: true, message: '请输入工单号', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '批次号',
    span: 12,
    prop: 'quantity',
    rules: [{ required: true, message: '请输入批次号', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '生成数量',
    span: 12,
    prop: 'receivingQuantity'
  },
  {
    type: 'Input',
    label: '机台号',
    span: 12,
    prop: 'nomenge'
  },
  {
    type: 'Input',
    label: '浆料批次',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入浆料批次', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '箔材批次',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入浆料批次', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '检验结果',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入检验结果', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '生产日期',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入生产日期', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '操作员',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入操作员', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '检验员',
    span: 12,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入检验员', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '备注',
    span: 24,
    prop: 'receivingNum',
    rules: [{ required: true, message: '请输入备注', trigger: 'onBlur' }]
  }
]
export const formList: Array<FormConfig> = [
  {
    type: 'Input',
    label: '载具条码',
    prop: 'boxCode',
    rules: [{ required: true, message: '请输入采购订单', trigger: 'onBlur' }]
  },
  {
    type: 'Input',
    label: '极卷条码',
    prop: 'purcbarCodehaseOrder'
    // rules: [{ required: true, message: '请输入条码', trigger: 'onBlur' }]
  },
  {
    type: 'Text',
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
