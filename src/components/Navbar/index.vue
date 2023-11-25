<template>
  <van-nav-bar
    :title="title"
    :left-text="leftText"
    :right-text="rightText !== '' ? rightText : '工号:' + currentUser.userName"
    :left-arrow="leftArrow"
    @click-left="clickLeft"
    @click-right="clickRight"
  />
</template>

<script lang="ts" setup>
 let props = defineProps({
    title: { type: String, default: '' }, // 导航栏标题
    leftText: { type: String, default: '' }, // 左侧文字
    rightText: { type: String, default: '' }, // 右侧文字
    users: { type: Object, default: () => {} }, //  用户信息
    leftArrow: { type: Boolean, default: true } // 是否显示左箭头
  })
  // data() {
  //   return {
  //     currentUser: {}, // 当前用户信息
  //     isShow: false
  //   }
  // },
  // onMounted(() => {
  //   getUser()
  // }),

    /** 右侧点击事件 */
    // function clickRight() {
    //   this.$emit('navBarRight')
    // },
    // /** 左侧点击事件-返回 */
    // function clickLeft() {
    //   this.$router.back()
    //   // this.$emit('clickLeft')
    // },
    // /** 获取session保存的 当前登录用户信息 */
    // function getUser() {
    //   this.currentUser = this.$store.getters.users
    //   this.$emit('update:users', this.currentUser)
    // }

</script>

<style scoped lang="scss">
</style>
