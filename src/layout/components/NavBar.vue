<template>
  <van-nav-bar class="nav-bar">
    <template #left>
      <div class="box-container">
        <div class="left-container" @click="clickLeft">
          <van-icon v-if="leftArrow" name="arrow-left" class="left-icon" />
          <span>{{ title }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <!-- <span v-if="el.$route.name == 'Dashboard'">{{versionText}}</span> -->
          <span>{{ versionText }}</span>
        </div>
        <div class="right-container" @click="handleLogout">
          <span>{{ currentUser.name }}</span>
        </div>
      </div>
    </template>
  </van-nav-bar>
</template>

<script lang="ts" setup name="NavBarVue">
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
import { showConfirmDialog } from 'vant'
import useStore from '@/store'
import { removeToken } from '@/utils/auth'
let { user } = useStore()

defineProps({
  title: { type: String, default: '' }, // 导航栏标题
  leftArrow: { type: Boolean, default: true }, // 是否显示左箭头
  version: { type: Boolean, default: true } // 是否显示版本号
})

let _this = getCurrentInstance() as ComponentInternalInstance
let el = _this.appContext.config.globalProperties

// let currentUser = ref(user.user)
let userInfo = localStorage.getItem('userInfo')
let currentUser = eval('(' + userInfo + ')')
let versionText = localStorage.getItem('version')
// onMounted(() => {
//   getVersion()
// })
// function getVersion(){
//   WMSAPI.get('business', { }, 'AppVersion/all').then((res) => {
//     let versionText = ref<string>(res.items[0].version as string)
//        console.log(versionText)
//   })
// }
function clickLeft() {
  el?.$router.go(-1)
}
function handleLogout() {
  showConfirmDialog({
    title: '提示',
    message: '确认要退出吗？'
  })
    .then(() => {
      user.LogOut().then(() => {
        location.reload()
        removeToken()
        localStorage.removeItem('userInfo')
        user.token = ''
        user.roles = []
      })
    })
    .catch(() => {
      // on cancel
    })
}
</script>

<style scoped lang="scss">
// 垂直居中-水平居中
.nav-bar :deep(.van-nav-bar__left) {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.box-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .left-container {
    text-align: left;
    width: 60%;
    // display: flex;
    align-items: center;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: keep-all;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .right-container {
    justify-content: center;
    text-align: right;
    flex: 1;
    word-wrap: break-word;
    word-break: normal;
  }
}
</style>
