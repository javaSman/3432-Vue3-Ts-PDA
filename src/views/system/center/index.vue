<template>
  <div class="center-container">
    <!-- <van-nav-bar title="个人信息" /> -->
    <div class="center-content">
      <van-cell-group class="user-info">
        <van-cell title="用户工号">
          <div class="user-right">{{ dataMap.user.userName }}</div>
        </van-cell>
        <van-cell title="用户姓名">
          <div class="user-right">{{ dataMap.user.name }}</div>
        </van-cell>
        <van-cell title="手机号码">
          <div class="user-right">{{ dataMap.user.phoneNumber }}</div>
        </van-cell>
        <van-cell title="用户邮箱">
          <div class="user-right">{{ dataMap.user.email }}</div>
        </van-cell>

        <van-cell class="cellRight" title="信息设置" value="" is-link to="updateInfo" />
        <van-cell class="cellRight" title="安全设置" value="" is-link to="updatePass" />
        <!-- <van-cell title="当前环境">
          <div class="user-right">{{ user.email }}</div>
        </van-cell> -->
        <van-cell class="cellRight" title="当前版本" is-link  @click="handleUpgrade">
          <!-- <template #title>
            <span class="custom-title">当前版本</span>
          </template>-->
          <div class="user-right">
            {{ dataMap.env }} {{ dataMap.currentVersion }}
            <van-tag v-show="dataMap.hasUpdate" type="danger">new</van-tag>
          </div>
        </van-cell>
      </van-cell-group>
    </div>
    <van-button native-type="button" type="primary" style="width: 95%; margin: 30px 0" @click="handleLogout">
        退出登录
      </van-button>
    <!-- <VersionUpdate
      :is-show-version="isShowVersion"
      :version-title="versionTitle"
      :version-msg="versionMsg"
      :apk-name="apkName"
      @cancel="dialogCancel"
    /> -->
  </div>
  <!-- 底部导航栏 -->
<div class="footer-bar">
<van-tabbar v-model="active" route placeholder active-color="rgb(22, 119, 255)">
      <van-tabbar-item  to="/dashboard">
       <span>首页</span>
    <template #icon="props">
      <img :src="props.active ? iconHome.active : iconHome.inactive" />
    </template>
      </van-tabbar-item>
      <van-tabbar-item icon="manager-o" to="/center">
        <span>我的</span>
    <template #icon="props">
      <img :src="props.active ? iconMine.active : iconMine.inactive" />
    </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
    <!-- /底部导航栏 -->
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import { showConfirmDialog } from 'vant'
import useStore from '@/store'
import { removeToken } from '@/utils/auth'
import { WMSAPI } from '@/api/generalAPI'
const APIName = 'identity'
const active = ref(0)
const iconHome = {
      active: require('../../../assets/images/homeActive.png'),
      inactive:
      require('../../../assets/images/home.png'),
    };
    const iconMine = {
      active: require('../../../assets/images/mineActive.png'),
      inactive:
      require('../../../assets/images/mine.png'),
    };
let { user } = useStore()

let dataMap = reactive({
  user: {} as any,
  currentVersion: '', // 当前版本名
  env: '', // 当前环境
  hasUpdate: false, // 是否有新版本
})
onMounted(() => {
  getUserInfo()
  // getEnv()
})
// function getEnv() {
//   if (process.env.NODE_ENV === 'production') {
//   // 生产环境的代码

// } else if (process.env.NODE_ENV === 'development') {
//   debugger
//   // 测试环境的代码
// }
// }
 /** 获取登录账户信息，当前apk版本名*/
 function getUserInfo() {
    WMSAPI.get(APIName,{},'my-profile').then(res => {
      debugger
      dataMap.user = res
        if (!window.plus) {
          return
        }
        // eslint-disable-next-line no-undef
        dataMap.currentVersion = plus.runtime.version // 当前版本名
      })
    }
        /** 当前版本查看，有新版本则推送新版本，否则提示 */
    // function  handleUpgrade() {
    //   if (dataMap.hasUpdate) {
    //     this.isShowVersion = true
    //   } else {
    //     this.$toast('当前版本是最新版本')
    //   }
    // }
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

<style scoped  lang="scss">
.center-container {
  width: 100%;
  height: 100%;
  text-align: center;
}
.center-content {
  border-radius: 10px;
  background: #fff;
  width: 95%;
  margin-top: 10px;
  display: inline-block;
  vertical-align: middle;
}
.center-container .user-right {
  float: right;
  color: #000;
}
.user-info {
  text-align: left;
}
.cellRight .van-cell__value {
  text-align: right;
}
.footer-bar{
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>