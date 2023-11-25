<template>
  <div class="ttable">
    <van-cell-group inset>
      <van-field  v-model="value" placeholder="请扫描或输入标签编码、数量" @keyup.enter="enter(value)">
        <!-- <template #value>
     {{ modelValue}}
    </template> -->
  </van-field>
      
    </van-cell-group>
    <ul>
      <!--横向分类-->
      <li class="ttable-item header">
        <span class="ttable-item-content" v-for="item in columns" :key="item.key">{{ item.title }}</span>
      </li>
      <!--内容-->
      <li class="ttable-item" v-for="(item, index) in dataSource" :key="index">
        <span class="ttable-item-content" v-for="(it, idx) in columnSlot" :key="idx">
          <slot :content="item" :name="it" />
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { computed, defineProps, ref, defineEmits } from "vue";
let emits = defineEmits(['update:modelValue', 'enter'])
const props = defineProps({
  modelValue: { type: String,default: () => ''}, // 搜索v-model
  columns: {
    type: Array
  },
  dataSource: {
    type: Array
  }
})
const value = ref('')
/** 表单值，val */
// let searchValue = computed({
//   get: () => props.modelValue,
//   set: (val) => emits('update:modelValue', val)
// })

// 定义要发送的emit事件
// const emit = defineEmits(['handleSearch'])
// const enter = (searchValue: string) => {
//   emit('handleSearch', searchValue)
// }
function enter(value){
  emits('enter',value)
}
let columnSlot = computed(() => {
  const filterColumns = props.columns.length && props.columns.map((v) => {
    return v.slot
  })
  return filterColumns
})
</script>
<style scoped>
/deep/ .van-cell {
  padding: 7px 0px;
}

/deep/ .van-field__control {
  padding-left: 5px;
  border: 1px solid rgb(220, 220, 220);
  border-radius: 4px;
}
</style>
<style scoped lang="scss">
.ttable {
  width: 95%;
  background: #ffffff;
  margin: 0 auto;

  .ttable-item {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    border-bottom: 1px solid rgb(238, 238, 238);
  }

  .header {
    margin-bottom: 8px;
  }

  &-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;

    &-content {
      flex: 1;
    }
  }
}
</style>