<template>
    <div class="updateInfo-container">
        <van-nav-bar title="用户资料" left-text="返回" left-arrow @click-left="$router.back()" />
        <div class="center-content">
            <van-form ref="form" :model="dataMap.form" size="small" label-width="65px">
                <van-cell-group>
                    <van-cell>
                        <van-field v-model="dataMap.form.name" label="昵称" name="name" :rules="dataMap.rules.name" />
                        <!-- <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span> -->
                    </van-cell>
                    <van-cell>
                        <van-field v-model="dataMap.form.phoneNumber" label="手机号" name="phoneNumber" :rules="dataMap.rules.phoneNumber" />
                        <!-- <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span> -->
                    </van-cell>
                    <van-cell>
                        <van-field v-model="dataMap.form.email" label="邮箱" name="email" :rules="dataMap.rules.email" />
                        <!-- <span style="color: #C0C0C0;margin-left: 10px;">邮箱不能重复</span> -->
                    </van-cell>
                </van-cell-group>
                <van-button native-type="button" type="primary" :loading="dataMap.saveLoading" style="width: 95%; margin: 30px 0">
                    保存
                </van-button>
            </van-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
let dataMap = reactive({
    saveLoading: false,
    user: {},
    form: {
        name: '',
        phoneNumber: '',
        email: ''
    },
    rules: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            pattern: /^.{2,20}$/,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
            message: '请输入正确的11位手机号码',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: '请输入正确的邮箱格式',
            trigger: 'blur'
          }
        ]
      }
})
</script>
<style scoped>
.van-form {
  margin: 12px auto!important;
}

:deep(div .van-cell) {
  border-radius: 0;
  font-size: 12px;
  font-weight: 400;
  /* border-bottom: 1px solid rgb(238, 238, 238); */
  padding: 4px 5px;
}
</style>