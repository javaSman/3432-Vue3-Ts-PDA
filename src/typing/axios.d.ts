/** 接口模型 */
export interface IViewResponse<T = IViewPageList | number | string | any[]> {
  data?: any
  box?: any
  header?: any
  details?: any
  result?: any
  success: boolean
  code: string
  msg: string
  name?: string
  userName?: string
  quantity: Number
  message?: string
  data?: T
  datas?: any[]
  items?: any[]
  zipFlag: boolean
}
/** 接口data模型 */
export interface IViewPageList<T = any> {
  data: T[]
  title: T
  version: number
}
