<template>
  <div class="layout-flex-container">
    <!-- 顶部导航栏 -->
    <NavBarVue :title="title" :leftArrow="leftArrow"/>
    <!-- 子路由出口 -->
    <div class="layout-flex-main">
      <router-view />
    </div>
    <!-- /子路由出口 -->
    <!-- 底部提示 -->
    <!-- <FootBar class="layout-flex-footer" /> -->
    <!-- 底部导航栏 -->
<!-- <div class="footer-bar">
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
  </div> -->
    <!-- /底部导航栏 -->
  </div>
</template>
<script lang="ts">
import { WMSAPI } from '@/api/generalAPI'
const cachedName = 'LayoutIndex'
export default {
  name: cachedName
}
</script>

<script lang="ts" setup>
import NavBarVue from './components/NavBar.vue'
import { watch, ref, ComponentInternalInstance, getCurrentInstance, onMounted } from 'vue'
import { WMSAPI } from '@/api/generalAPI'
// const active = ref(0)
// const iconHome = {
//       active: require('../assets/images/homeActive.png'),
//       inactive:
//       require('../assets/images/home.png'),
//     };
//     const iconMine = {
//       active: require('../assets/images/mineActive.png'),
//       inactive:
//       require('../assets/images/mine.png'),
//     };
let _this = getCurrentInstance() as ComponentInternalInstance
let el = _this.appContext.config.globalProperties

// console.log(el.$route)
const title = ref<string>(el.$route.meta.title as string)
console.log(title,'title')
const leftArrow = ref<boolean>(el.$route.name !== 'Dashboard')
const version = ref<boolean>(el.$route.name !== 'Dashboard')
// debugger
// onMounted(() => {
//   getVersion()
// })
// function getVersion(){
//   WMSAPI.get('business', { }, 'AppVersion/all').then((res) => {
//     const versionText = ref<string>(res.items[0].version as string)
//        console.log(versionText)
//   })
// }
watch(
  () => [el.$route.name, el.$route.meta.title],
  ([_name, _title]) => {
    leftArrow.value = _name !== 'Dashboard'
    if (_name === 'second') {
      title.value = el.$route.query.text as string
    } else {
      title.value = _title as string
    }
  }
)
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
// 固定头部、底部-中间内容超出出现滚动条
.layout-flex-container {
  display: flex; // 父元素的定义为flex布局
  flex-direction: column; // 定义排列方向为竖排
  overflow: hidden;
  width: 100%;
  height: 100vh;
  text-align: center;
  // 中间分配剩下的所有空间
  // 菜单容器 位置定位，超出出现滚动条
  .layout-flex-main {
    flex: 1;
    overflow: auto;
    padding-bottom: 5px;
  }
}
.footer-bar{
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
