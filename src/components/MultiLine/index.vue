<template>
   <!-- <van-field v-model="label" readonly :name="item.prop" :label="item.label"
      :required="item.rules && item.rules.length > 0" is-link/> -->
  <van-row v-for="(item, index) in supplierConfig" :key="index"  v-show="index<2">
    <van-col span="1">
      <van-icon class="icon" name="minus" @click.prevent="removeSupplierConfig(item)" />
    </van-col>
    <van-col span="14">
      <van-field v-model="item.supplierBatch"  label="供应商批次" label-width="60" placeholder="请输入" clearable/>
    </van-col>
    <van-col span="8"><van-field v-model="item.receivingNum"  label="实收" label-width="30" placeholder="请输入" clearable/>
      </van-col>
    <van-col span="1">
      <!-- <van-icon class="icon" name="plus" @click="addSupplierConfig" /> -->
      <van-icon class="icon" name="plus" @click="addSupplierConfig(index)" />
      <van-icon v-if="index===1" class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" />
    </van-col>
    <!-- <van-col span="8">span: 8</van-col> -->
  </van-row>
  <div v-show="show">
    <van-row v-for="(item, index3) in  supplierConfig.slice(2)" :key="index2">
      <van-col span="1">
        <van-icon class="icon" name="minus" @click.prevent="removeSupplierConfig(item)" />
      </van-col>
      <van-col span="14">
        <van-field v-model="item.supplierBatch"  label="供应商批次" label-width="60" placeholder="请输入" clearable/>
      </van-col>
      <van-col span="8"><van-field v-model="item.receivingNum"  label="实收" label-width="30" placeholder="请输入" clearable/>
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
import { PropType, reactive, toRefs, ref, onMounted } from 'vue'
let props = defineProps({
  supplierConfig: { type: Array, default: [] }, // 信息条目索引
  supplierIndex: { type: Number, default: 0 }, // 信息条目索引
  detailsForm: { type: Array, default: [] }, 
})
// 参数声明
const show = ref(false)
const formRef = ref(null)
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
  // console.log(val)
  // console.log(props.supplierIndex)
  // console.log(props.supplierConfig)
  // console.log(props.detailsForms)
  const copiedSupplierConfig = JSON.parse(JSON.stringify(props.supplierConfig));

// 修改深拷贝的对象
copiedSupplierConfig.push({
  supplierBatch: '',
  receivingNum: ''
});
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
  message:
    '确定要删除吗？',
})
  .then(() => {
    // on confirm
     // 删除行
  const index = props.supplierConfig.indexOf(item)
  if (index !== 0) {
    props.supplierConfig.splice(index, 1)
  }else{
    _showFailToast('至少保留一项！')
  }
  })
  .catch(() => {
    // on cancel
  });
}

const submitForm = () => {
  // 点击确定按钮，输出行内数据
  var supplierConfig = props.supplierConfig
  console.log(supplierConfig)
  console.log('水果名称：' + supplierConfig[0].supplierBatch)
  console.log('水果售价：' + supplierConfig[0].receivingNum)
}

// 数据解构
const { ruleForm, rules } = {
  ...toRefs(state)
}
</script>

<style scoped></style>
