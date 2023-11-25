import { WMSLogin, getKeyIdQYY } from '@/api/system/login'
import { getToken, setToken, removeToken, getKeyId, setKeyId, removeKeyId } from '@/utils/auth'
import { defineStore } from 'pinia'
import { UserState } from '@/typing'
// import { LoginFormData } from '@/api/model/System'
import { asyncRoutes } from '@/router/routers'
import { getAuthInfo } from '@/api/system/common'
import { WMSAPI } from '@/api/generalAPI'

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: getToken(),
    keyId: getKeyId(),
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    menus: [],
    noAuth: false, // 判断当前是否有菜单权限，true 为没有
    // 快捷菜单
    homeMenus: [],
    userList: [],
    permissions: [],
    authUserInfo: null // 授权参数
  }),
  // mutations: {
  //   /** 存储用户信息 */
  //   SET_USER_INFO: (state, data) => {
  //     // setItem('Users', data);
  //     state.permissions = data.permissions;
  //   }, // <-- 在这里添加逗号
  // },
  actions: {
    // 登录
    Login(_data: any) {
      return new Promise((resolve, reject) => {
        WMSLogin(_data)
          .then(async(res: any) => {
            if (!res.access_token) {
              // 调用reject方法后，Promise状态变为rejected，即操作失败状态
              reject('登录失败')
              return
            }
            // let _res = res.data.data
            // let _res = { account: 'admin', name: 'admin' }
            let permission = []
            let result = await getAuthInfo()
            // console.log(result)
            // debugger
            permission = result
            // commit('SET_USER_INFO', permission)
            this.getVersion()
            this.getUserInfo()
            // TODO: 由于个人信息是从登录返回而不是另开接口，一刷新该数据就没有了，所以该数据需要缓存到本地
            // localStorage.setItem('userInfo', JSON.stringify(_res))
            // 若rememberMe为true，token添加过期时间
            setToken(res.access_token, false)
            // TODO: 获取企业云keyId，目前没有权限，先写死用户工号
            this.GetKeyIdQYY('13383')
            // setkeyId(res.access_token)
            this.token = res.access_token
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            this.loadMenus = true
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 根据当前登录用户工号，获取企业云接口的keyId
    GetKeyIdQYY(account: string) {
      getKeyIdQYY(account)
        .then((res) => {
          // console.log(res)
          this.keyId = res.data.keyId
          setKeyId(res.data.keyId)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 获取用户
    // 获取用户信息
    getUserInfo() {
      WMSAPI.get('identity',{},'my-profile').then(res => {
        let _res = { account:  res.userName, name: res.name }
        localStorage.setItem('userInfo', JSON.stringify(_res))
        setUserInfo(_res)
      })
      },
      getVersion() {
        WMSAPI.get('business', { }, 'AppVersion/all').then((res) => {
          let version = res.items as any[]
          // localStorage.setItem('version', version[0].version)
          if (process.env.NODE_ENV === 'production') {
            // 生产环境的代码
            let env = '测试'
            localStorage.setItem('version',version[0].version+"             "+'('+env+')')
          } else if (process.env.NODE_ENV === 'development') {
            // 测试环境的代码
            let env = '测试'
            localStorage.setItem('version',version[0].version+"              "+'('+env+')')
          }
        })
      },
      // getEnv() {
      //   if (process.env.NODE_ENV === 'production') {
      //   // 生产环境的代码
        
      // } else if (process.env.NODE_ENV === 'development') {
      //   debugger
      //   // 测试环境的代码
      // }
      // },
    GetInfo() {
      // 刷新页面再次加载菜单前需要获取当前用户信息
      let userInfo = localStorage.getItem('userInfo')
      if (userInfo === null) {
        this.token = ''
        removeToken()
        this.keyId = ''
        removeKeyId()
        return false
      } else {
        let _info = JSON.parse(userInfo)
        this.token = getToken()
        this.menus = asyncRoutes
        // 重新加载用户信息
        setUserInfo(_info)
        return true
      }
      // return new Promise((resolve, reject) => {
      //   getInfo()
      //     .then((res) => {
      //       // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js;第一次加载不做缓存
      //       this.menus = res.data
      //       resolve(res)
      //     })
      //     .catch((error) => {
      //       // 如果是返回 null 表示没有任何菜单权限
      //       if (error === null) {
      //         this.noAuth = true
      //         resolve(null)
      //       }
      //       reject(error)
      //     })
      // })
    },
    // 登出
    LogOut() {
      // TODO:这里不使用接口先
      return new Promise((resolve) => {
        this.token = ''
        removeToken()
        resolve(true)
        // logout()
        //   .then((res: any) => {
        //     if (res.success) {
        //       this.token = ''
        //       removeToken()
        //       resolve(res)
        //     } else {
        //       // 跳转到登录页
        //       console.log(res)
        //       removeToken()
        //       resolve(res)
        //       // router.push({ path: '/login' })
        //     }
        //   })
        //   .catch((error) => {
        //     // this.token = ''
        //     // 退出登录失败也要跳转到登录，清除本地缓存
        //     removeToken()
        //     reject(error)
        //     console.log(error)
        //     // debugger
        //   })
        //   .finally(() => {
        //     localStorage.removeItem('userInfo')
        //   })
      })
    },
    updateLoadMenus() {
      return new Promise(() => {
        this.loadMenus = false
      })
    }
  }
})

export const logOut = () => {
  useUserStore().token = ''
  useUserStore().keyId = ''
  useUserStore().roles = []
  removeToken()
  removeKeyId()
  localStorage.removeItem('userInfo')
}

export const setUserInfo = (res: any) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // if (res.userRoleCodes === '') {
  //   useUserStore().roles = ['ROLE_SYSTEM_DEFAULT']
  // } else {
  //   useUserStore().roles = res.userRoleCodes.split(',')
  // }
  useUserStore().roles = ['admin']
  useUserStore().user = res
  // commit('SET_USER', res)
}

export default useUserStore
