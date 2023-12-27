<template>
  <!-- <van-field v-model="label" readonly :name="item.prop" :label="item.label"
      :required="item.rules && item.rules.length > 0" is-link/> -->
  <van-row v-for="(item, index) in supplierConfig" :key="index" v-show="index < 2">
    <van-col span="1">
      <van-icon class="icon" name="minus" @click.prevent="removeSupplierConfig(item)" />
    </van-col>
    <van-col span="14">
      <van-field
        v-model.trim="item.supplierBatch"
        label="供应商批次"
        label-width="60"
        placeholder="请输入"
        @blur="supplierBatchBlur"
      />
    </van-col>
    <van-col span="8">
      <van-field v-model.trim="item.receivingNum" label="实收" label-width="30" placeholder="请输入" />
    </van-col>
    <van-col span="1">
      <!-- <van-icon class="icon" name="plus" @click="addSupplierConfig" /> -->
      <van-icon class="icon" name="plus" @click="addSupplierConfig(index)" />
      <van-icon v-if="index === 1" class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" />
    </van-col>
    <!-- <van-col span="8">span: 8</van-col> -->
  </van-row>
  <div v-show="show">
    <van-row v-for="(item, index3) in supplierConfig.slice(2)" :key="index3">
      <van-col span="1">
        <van-icon class="icon" name="minus" @click.prevent="removeSupplierConfig(item)" />
      </van-col>
      <van-col span="14">
        <van-field
          v-model.trim="item.supplierBatch"
          label="供应商批次"
          label-width="60"
          placeholder="请输入"
          @blur="supplierBatchBlur"
        />
      </van-col>
      <van-col span="8">
        <van-field v-model.trim="item.receivingNum" label="实收" label-width="30" placeholder="请输入" />
      </van-col>
      <van-col span="1">
        <van-icon class="icon" name="plus" @click="addSupplierConfig(index3)" />
        <!-- <van-icon class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" /> -->
      </van-col>
      <!-- <van-col span="8">span: 8</van-col> -->
    </van-row>
  </div>
</template>
<script setup>
import { showConfirmDialog } from 'vant'
import { _showFailToast } from '@/utils/message'
import { reactive, toRefs, ref } from 'vue'
let emits = defineEmits(['supplierBatchBlur'])
let props = defineProps({
  supplierConfig: { type: Array, default: [] }, // 信息条目索引
  supplierIndex: { type: Number, default: 0 }, // 信息条目索引
  detailsForm: { type: Array, default: [] },
  isRules: { type: Boolean, default: false } // 供应商编码是否有校验规则标识
})
// 参数声明
const show = ref(false)
// const formRef = ref(null)
const state = reactive({
  val: '',
  // list: [] as any,
  ruleForm: {
    supplierConfig: [
      {
        supplierBatch: '',
        receivingNum: ''
      }
    ]
  }
})
// onMounted(() => {
//   console.log(props.supplierConfig,'[]'),
//   props.supplierConfig.forEach((item: any, index) => {
//       debugger
//       })
// })
// const handleInputChange = (event) => {
// 	console.log(event);
// 	inpval.value = event.target.value;
// 	// 如果输入框为空，进行相关的逻辑
// 	if(inpval.value == ''){
// 		searchShop.commodityList()
// 	}
// };
const addSupplierConfig = (val) => {
  state.val = val
  const copiedSupplierConfig = JSON.parse(JSON.stringify(props.supplierConfig))
  // 修改深拷贝的对象
  copiedSupplierConfig.push({
    supplierBatch: '',
    receivingNum: ''
  })
  // console.log(copiedSupplierConfig);
  // debugger
  props.detailsForm[props.supplierIndex].multiLine = copiedSupplierConfig

  //   props.supplierConfig.push({
  //    supplierBatch: '',
  //    receivingNum: ''
  // })

  // 新增行
  //     props.supplierConfig[`multiLine${props.supplierIndex}`].push({
  //   [`supplierBatch${props.supplierIndex}`]: '',
  //   [`receivingNum${props.supplierIndex}`]: ''
  // })
  // props.supplierConfig.forEach((item, index) => {
  //   for(let i in item){
  //     console.log(item[i])
  //   }
  // })
}

const removeSupplierConfig = (item) => {
  showConfirmDialog({
    title: '标题',
    message: '确定要删除吗？'
  })
    .then(() => {
      // 删除行
      const index = props.supplierConfig.indexOf(item)
      if (props.supplierConfig.length !== 1) {
        props.supplierConfig.splice(index, 1)
      } else {
        _showFailToast('至少保留一项！')
      }
    })
    .catch(() => {
      // on cancel
    })
}
function supplierBatchBlur(e) {
  if (props.isRules) {
    // console.log(props.detailsForm[0].supplierCode, e.target.value.trim(), 'e')
    // 替换所有的空白字符为空字符串
    e.target.value = e.target.value.replace(/\s/g, '')
    // 然后检查替换后的字符串是否都是数字并且是14位
    let isAllDigitsAnd14Chars = /^\d{14}$/.test(e.target.value)
    if (!isAllDigitsAnd14Chars) {
      _showFailToast('供应商批次必须是14位的数字！')
      return
    }
    // 截取前8位
    let firstEight = e.target.value.substring(0, 8)
    if (firstEight !== props.detailsForm[0].supplierCode) {
      _showFailToast('供应商批次填写错误！')
      return
    }
    // 截取后6位
    let lastSix = '20' + e.target.value.slice(-6)
    let date = new Date() // 创建一个新的Date对象，它会自动被设置为当前日期和时间
    let year = date.getFullYear() // 获取年份
    let month = date.getMonth() + 1 // 获取月份（注意：月份是从0开始的，所以我们需要+1）
    let day = date.getDate() // 获取日期
    // 校验生产日期不能大于当前操作日期
    if (Number(lastSix) > Number(year + '' + month + '' + day)) {
      _showFailToast('供应商批次填写错误！')
      return
    }
    // // 截取中间8位
    // let last1 = e.target.value.slice(8, 10) // 年
    // let last2 = e.target.value.slice(10, 12) // 月
    // let last3 = e.target.value.slice(12, 14) // 日
    // console.log(last1, last2, last3)

    // console.log(year + '' + month + '' + day) // 输出格式化的日期
  }
  emits('supplierBatchBlur', e.target.value.trim())
}
// 数据解构
const { ruleForm, rules } = {
  ...toRefs(state)
}
</script>

<style scoped></style>
