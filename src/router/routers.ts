import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'
export const Layout = () => import('@/layout/index.vue')

export const constantRouterMap: Array<RouteRecordRaw> = [
  {
    path: '/login',
    meta: { title: '登录', noCache: true, hidden: true },
    component: () => import('@/views/login.vue')
  },
  {
    path: '/updatePass',
    meta: { title: '修改密码', noCache: true, hidden: true },
    component: () => import('@/views/system/center/module/updatePass.vue')
  },
  {
    path: '/updateInfo',
    meta: { title: '修改信息', noCache: true, hidden: true },
    component: () => import('@/views/system/center/module/updateInfo.vue')
  },
  {
    path: '/download',
    meta: { title: '登录', noCache: true, hidden: true },
    component: () => import('@/views/download.vue')
  },
  {
    path: '/404',
    component: () => import('@/views/features/404.vue'),
    meta: { title: '404', hidden: true }
  },
  {
    path: '/401',
    component: () => import('@/views/features/401.vue'),
    meta: { title: '401', hidden: true }
  },
  {
    path: '/redirect',
    component: Layout,
    meta: { title: '401', hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '', hidden: true },
    // name: 'Dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/system/home/index.vue'),
        name: 'Dashboard',
        meta: { title: '', icon: 'sw-home' }
      },
      {
        path: '/center',
        component: () => import('@/views/system/center/index.vue'),
        name: 'center',
        meta: { title: '', icon: 'sw-home' }
      }
      // {
      //   path: 'second',
      //   component: () => import('@/views/system/home/second.vue'),
      //   name: 'second',
      //   meta: { title: '', icon: null }
      // }
    ]
    // MARK "alwaysShow": true, 就是会让当前菜单为二级菜单
  }
  // {
  //   path: '/center',
  //   component: Layout,
  //   meta: { title: 'user', hidden: true },
  //   // redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'center',
  //       component: () => import('@/views/system/center/index.vue'),
  //       name: '个人中心',
  //       meta: { title: '个人中心' }
  //     }
  //   ]
  // }
  // {
  //   path: '/user/settings',
  //   component: Layout,
  //   meta: { title: '账户设置', hidden: true },
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'base',
  //       component: () => import('@/views/system/user/settings/index.vue'),
  //       meta: { title: '账户设置' },
  //       name: '账户设置'
  //     }
  //   ]
  // }
]

export const asyncRoutes = [
  {
    alwaysShow: false,
    hidden: false,
    path: '/warehousing',
    name: 'warehousing',
    // redirect: '/receive/103POReceiveToQuality',
    meta: { title: '入库业务', icon: '', hidden: false, roles: [''] },
    component: 'Layout',
    // component: 'receive/103POReceiveToQuality/index',
    children: [
      {
        alwaysShow: false,
        hidden: false,
        path: 'materialReceipt',
        name: 'warehousing.materialReceipt',
        meta: { title: '物料收货', icon: 'received', hidden: false, roles: ['warehousing.materialReceipt'] },
        component: 'warehousing/materialReceipt/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'materialGround',
        name: 'warehousing.materialGround',
        meta: { title: '物料上架', icon: 'grounding', hidden: false, roles: ['warehousing.materialGround'] },
        component: 'warehousing/materialGround/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'productWarehousing',
        name: 'warehousing.productWarehousing',
        meta: { title: '成品入库', icon: 'grounding', hidden: false, roles: ['warehousing.productWarehousing'] },
        component: 'warehousing/productWarehousing/index'
      },
      // {
      //   alwaysShow: false,
      //   hidden: true,
      //   path: 'lowHumidity',
      //   name: 'warehousing.lowHumidity',
      //   meta: { title: '低湿手工入库', icon: 'grounding', hidden: false , roles: ['warehousing.lowHumidity'] },
      //   component: 'warehousing/lowHumidity/index'
      // },
      {
        alwaysShow: false,
        hidden: false,
        path: 'returnMaterials',
        name: 'warehousing.returnMaterials',
        meta: { title: '退料入库', icon: 'grounding', hidden: false, roles: ['warehousing.returnMaterials'] },
        component: 'warehousing/returnMaterials/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'solidWaste',
        name: 'warehousing.solidWaste',
        meta: { title: '固废入库', icon: 'grounding', hidden: false, roles: ['warehousing.solidWaste'] },
        component: 'warehousing/solidWaste/index'
      }
    ]
  },
  {
    alwaysShow: false,
    hidden: false,
    path: '/outBounding',
    name: 'outBounding',
    meta: { title: '出库业务', icon: '', hidden: false, roles: ['outBounding'] },
    component: 'Layout',
    children: [
      {
        alwaysShow: false,
        hidden: false,
        path: 'materialOutbound',
        name: 'outBounding.materialOutbound',
        meta: { title: '备料出库', icon: 'outbound', hidden: false, roles: ['outBounding.materialOutbound'] },
        component: 'outBounding/materialOutbound/index'
      },
      // {
      //   alwaysShow: false,
      //   hidden: false,
      //   path: 'materialPreparation',
      //   name: 'outBounding.materialPreparation',
      //   meta: { title: '备料换标', icon: 'grounding', hidden: false , roles: ['outBounding.materialPreparation'] },
      //   component: 'outBounding/materialPreparation/index'
      // },
      {
        alwaysShow: false,
        hidden: true,
        path: 'callEmpty',
        name: 'outBounding.callEmpty',
        meta: { title: '呼叫空托盘', icon: 'grounding', hidden: false, roles: ['outBounding.callEmpty'] },
        component: 'outBounding/callEmpty/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'incomingQuality',
        name: 'outBounding.incomingQuality',
        meta: { title: '来料质检退货', icon: 'grounding', hidden: false, roles: ['outBounding.incomingQuality'] },
        component: 'outBounding/incomingQuality/index'
      }
    ]
  },
  {
    alwaysShow: false,
    hidden: false,
    path: '/transfer',
    name: 'transfer',
    redirect: '/transfer/transferOut',
    meta: { title: '调拨业务', icon: '', hidden: false, roles: ['transfer'] },
    component: 'Layout',
    children: [
      {
        alwaysShow: false,
        hidden: false,
        path: 'transferOut',
        name: 'transfer.transferOut',
        meta: { title: '调拨发出', icon: 'grounding', hidden: false, roles: ['transfer.transferOut'] },
        component: 'transfer/transferOut/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'transferReceipt',
        name: 'transfer.transferReceipt',
        meta: { title: '调拨接收', icon: 'grounding', hidden: false, roles: ['transfer.transferReceipt'] },
        component: 'transfer/transferReceipt/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'vehicleAllocation',
        name: 'transfer.vehicleAllocation',
        meta: { title: '载具间调拨', icon: 'grounding', hidden: false, roles: ['transfer.vehicleAllocation'] },
        component: 'transfer/vehicleAllocation/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'transferLocations',
        name: 'transfer.transferLocations',
        meta: { title: '货位间调拨', icon: 'grounding', hidden: false, roles: ['transfer.transferLocations'] },
        component: 'transfer/transferLocations/index'
      }
    ]
  },
  {
    alwaysShow: false,
    hidden: false,
    path: '/insideWarehouse',
    name: 'insideWarehouse',
    redirect: '/insideWarehouse/unpackingWarehouse',
    meta: { title: '库内业务', icon: 'WMSFunction', hidden: false, roles: ['insideWarehouse'] },
    component: 'Layout',
    children: [
      {
        alwaysShow: false,
        hidden: false,
        path: 'unpackingWarehouse',
        name: 'insideWarehouse.unpackingWarehouse',
        meta: { title: '在库拆标', icon: 'grounding', hidden: false, roles: ['insideWarehouse.unpackingWarehouse'] },
        component: 'insideWarehouse/unpackingWarehouse/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'incomingNG',
        name: 'insideWarehouse.incomingNG',
        meta: { title: '来料NG拆标', icon: 'grounding', hidden: false, roles: ['insideWarehouse.incomingNG'] },
        component: 'insideWarehouse/incomingNG/index'
      },
      // {
      //   alwaysShow: false,
      //   hidden: false,
      //   path: 'qualityInspection',
      //   name: 'insideWarehouse.qualityInspection',
      //   meta: { title: '在库质检', icon: 'grounding', hidden: false , roles: ['insideWarehouse.qualityInspection'] },
      //   component: 'insideWarehouse/qualityInspection/index'
      // },
      {
        alwaysShow: false,
        hidden: false,
        path: 'materialLnventory',
        name: 'insideWarehouse.materialLnventory',
        meta: { title: '物料盘点', icon: 'grounding', hidden: false, roles: ['insideWarehouse.materialLnventory'] },
        component: 'insideWarehouse/materialLnventory/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'vehicleCleaning',
        name: 'insideWarehouse.vehicleCleaning',
        meta: { title: '载具清洗', icon: 'grounding', hidden: false, roles: ['insideWarehouse.vehicleCleaning'] },
        component: 'insideWarehouse/vehicleCleaning/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'verticalStorageTray',
        name: 'insideWarehouse.verticalStorageTray',
        meta: {
          title: '立库托盘绑定',
          icon: 'grounding',
          hidden: false,
          roles: ['insideWarehouse.verticalStorageTray']
        },
        component: 'insideWarehouse/verticalStorageTray/index'
      }
    ]
  },
  {
    alwaysShow: false,
    hidden: false,
    path: '/query',
    name: 'query',
    redirect: '/query/index',
    meta: { title: '查询业务', icon: 'query', hidden: false, roles: ['query'] },
    component: 'Layout',
    children: [
      {
        alwaysShow: false,
        hidden: false,
        path: 'numberQuery',
        name: 'query.numberQuery',
        meta: { title: '料号查询', icon: 'grounding', hidden: false, roles: ['query.numberQuery'] },
        component: 'query/numberQuery/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'batchQuery',
        name: 'query.batchQuery',
        meta: { title: '批次查询', icon: 'grounding', hidden: false, roles: ['query.batchQuery'] },
        component: 'query/batchQuery/index'
      },
      {
        alwaysShow: false,
        hidden: false,
        path: 'goodsQuery',
        name: 'query.goodsQuery',
        meta: { title: '货位查询', icon: 'grounding', hidden: false, roles: ['query.goodsQuery'] },
        component: 'query/goodsQuery/index'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: constantRouterMap
})
export default router
