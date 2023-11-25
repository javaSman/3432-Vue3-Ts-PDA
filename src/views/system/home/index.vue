<template>
  <!-- 需要加载有权限的菜单列表 -->
  <div class="menu-container">
  <div class="menu-block"  v-for="item in sidebarRouters">
      <!-- 菜单大标题 -->
      <div class="menu-title">
      <span>{{item.meta.title }}</span>
    </div>
  <van-grid column-num="3" :gutter="5" :border="false">
    <van-grid-item
      v-for="menu in item.children"
      :key="menu.meta?.title"
      :text="menu.meta?.title"
      class="border-grid"
      @click="handleToSecond(menu)"
    >
      <!-- <van-image fit="fill" :src="require(`@/assets/img/${menu.meta?.icon || 'lyric'}.png`)" /> -->
         <div class="circle"> <SvgIcon :iconFileName="menu.meta?.icon" /></div>
      
       <div class="circle-title">{{ menu.meta?.title }}</div>
    </van-grid-item>
  </van-grid>
</div>
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

<script lang="ts" setup name="Dashboard">
import SvgIcon from '@/components/SvgIcon/index.vue'
import { computed, getCurrentInstance, ComponentInternalInstance, ref } from 'vue'
import useStore from '@/store'
import { _showFailToast } from '@/utils/message'
const { permission } = useStore()
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
let _this = getCurrentInstance() as ComponentInternalInstance
let el = _this.appContext.config.globalProperties

const sidebarRouters = computed<any[]>(() => {
  let list: any[] = []
  permission.sidebarRouters.forEach((item) => {
    if (!item.meta || !item.meta.hidden) list.push(item)
  })
  console.log(list)
  return list
})

function handleToSecond(item: any) {
  console.log(item,'113')
  if (item.meta) {
    // el?.$router.push({ name: 'second', query: { name: item.name, text: item.meta.title,level:'second'} })
    el?.$router.push({ path: item.name.replace(".","/")})
  } else {
    el?.$router.push({ name: 'second'})
  }
}
</script>

<style lang="scss" scoped>
// 菜单容器 位置定位，超出出现滚动条
.menu-container {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  bottom: 50px;
  padding-bottom: 5px;
  overflow-y: scroll;
}
.menu-block {
  width: 90%;
  border-radius: 10px;
  display: inline-block;
  vertical-align: middle;
  background: #fff;
  margin-top: 10px;
  padding: 10px;
}
.menu-title {
  padding-left: 20px;
  text-align: left;
}
.menu-title span {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  text-align: left;
  position: relative;
}
.menu-title span::before {
  background: #000;
  content: '';
  width: 4px;
  height: 14px;
  position: absolute;
  top: 0px;
  left: -9px;
  background: #1e90ff;
}
.svg-container {
  padding-bottom: 10px;
  font-size: 25px;
}
.circle {
 width: 50px;
 height: 50px;
 border-radius: 50px;
 background-color: rgb(22, 119, 255);
 text-align: center;
 line-height: 50px;
}
.circle-title{
  height: 34px;
}
.footer-bar{
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  right: 0;
}
// .border-grid :deep(.van-grid-item__content) {
//   padding: 3px;
//   margin-top: 10px;
//   border-radius: 10px;
//   box-shadow: 0 0 10px 2px #dde2ea;
//   font-size: 0.9rem;
//   background-color: transparent;
//   .van-image {
//     margin-bottom: 5px;
//   }
// }
</style>
