<template>
  <FormVue class="form" ref="formComponent" v-model:formData="form" :formList="dataMap.formList" />
  <van-tabs v-model:active="active" v-if="dataMap.detailsForm.length > 0">
    <van-tab title="收货明细">
      <DetailsVue
        v-for="(item, index) in dataMap.detailsForm"
        :key="index"
        v-model:formData="dataMap.detailsForm[index]"
        :formList="dataMap.detailsForm[index].detailsList"
        :label-width="50"
        :supplierConfig="dataMap.detailsForm[index].multiLine"
        :index="index"
        @supplierList="getSupplierList(dataMap.detailsForm[index])"
        :detailsForm= "dataMap.detailsForm"
      >
    </DetailsVue>
    <div class="multiLine" v-if="dataMap.multiLineShow">
    <div class="mask"></div>
     <div class="pop">
      <div  v-for="(item, itemIndex) in dataMap.items" :key="itemIndex">
        <div v-for="(subItem, subItemIndex) in item.subArray" :key="subItemIndex">
    <van-row  v-for="prop in dataMap.objectProperties" :key="prop">
    <van-col span="1">
      <van-icon class="icon" name="plus" @click="addSupplierConfig(itemIndex)" />
    </van-col>
    <van-col span="14">
      <van-field  v-model="subItem[prop]" :label="prop" label-width="60" placeholder="请输入" clearable/>
    </van-col>
    <!-- <van-col span="8"><van-field v-model="item.receivingNum"  label="实" label-width="30" placeholder="请输入" clearable/>
      </van-col> -->
    <van-col span="1">
      <van-icon class="icon" name="minus" @click.prevent="removeSupplierConfig(itemIndex, subItemIndex)" />
      <van-icon v-if="index===1" class="icon" :name="show ? 'arrow-down' : 'arrow'" @click="show = !show" />
    </van-col>
  </van-row>
</div>
</div>
  <van-button type="primary" size="mini" @click="mulineSubmit">确定</van-button>
     </div>
  </div>
    </van-tab>
    <!-- <van-tab title="不可收货明细"> -->
    <!-- <TableContent :columns="dataMap.columns" :dataSource="dataMap.dataList">
        <template v-slot:changeMsg="{ content }">
          {{ content.changeMsg }}
        </template>
        <template v-slot:currentPrice="{ content }">
          {{ content.currentPrice }}
        </template>
        <template v-slot:lowestPrice="{ content }">
          <span class="campaignItem-canChangeNum-style">{{ content.lowestPrice }}</span>
        </template>
        <template v-slot:highestPrice="{ content }">
          <span class="campaignItem-canChangeNum-style">{{ content.highestPrice }}</span>
        </template>
        <template v-slot:delete="{ content }">
          <span class="campaignItem-canChangeNum-style" @click.prevent="removeItem(content)">删除</span>
        </template>
      </TableContent> -->
    <!-- </van-tab> -->
  </van-tabs>
  <!-- <DetailsVue v-model:formData="dataMap.detailsForm" :formList="dataMap.detailsList" v-show="dataMap.show"></DetailsVue> -->
  <ActionBarVue
    ref="actionBarVue"
    :loading="dataMap.loading"
    :confirmText="dataMap.confirmText"
    @clear="handleClear"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts">
// 物料收货
const cachedName = 'warehousing.materialReceipt'
export default {
  name: cachedName
}
</script>
<script lang="ts" setup>
import FormVue from '@/components/Form/index.vue'
import DetailsVue from '@/components/Details/index.vue'
import ActionBarVue from '@/views/businessComponents/ActionBar.vue'
import ToggleFormVue from '@/views/businessComponents/ToggleForm.vue'
import TableDialogVue from '@/views/businessComponents/TableDialog.vue'
import { WMSAPI } from '@/api/generalAPI'
import { ref, reactive, onMounted } from 'vue'
import Dates from '@/utils/datetime'
import { formList, detailsList, showFormList, tableColumn } from './config'
import { ITableBtnParams, TableColumn } from '@/typing'
import { getPartList, partListTableColumn } from '@/views/mixins/PartList'
import { showSuccessToast } from 'vant'
import { _showFailToast } from '@/utils/message'

let formComponent = ref<InstanceType<typeof FormVue> | null>(null)
let dataMap = reactive({
  list: [] as any[],
  formList,
  detailsList,
  // form: {} as any,
  detailsForm: [] as any,
  detailsFormClone: [] as any,
  // detailsForm:[{imBarcode:'1234',purchaseOrder:'物料编码1',nomenge:'',menge:20,receivingmenge:5},{imBarcode:'1234',purchaseOrder:'物料编码2',nomenge:'',menge:20,receivingmenge:2},{imBarcode:'1234',purchaseOrder:'物料编码3',nomenge:'',menge:20,receivingmenge:10}],
  show: false,
  loading: false,
  confirmText: '确定',
  supplierCode: '', //供应商编号
  multiLineShow: false,
  multiList: [] as any,
  newList: [] as any,
  items: [
      { 
        subArray: [
          { supplierBatch: 'value1', receivingNum: 'value2' },
          { supplierBatch: 'value3', receivingNum: 'value4' }
        ]
      },
      // {
      //   subArray: [
      //     { supplierBatch: 'value5', receivingNum: 'value6' },
      //     { supplierBatch: 'value7', receivingNum: 'value8' }
      //   ]
      // }
    ],
    objectProperties: ['supplierBatch', 'receivingNum'], // 属性数组
    supplierConfig: [
      {
        supplierBatch: '',
        receivingNum: ''
      }
    ],
  ruleForm: {
    supplierConfig: [
      {
        // supplierBatch: '',
        // receivingNum: ''
      }
    ]
  }
})
const today = new Dates(new Date()).strftime('YYYY-MM-DD')
const APIName = 'business'
const active = ref(0)
const form = ref({
  date: today,
  warehouse: '',
  purchaseOrder: '',
  supplierName: '',
  locID: '',
  materialID: '',
  message: ''
})
onMounted(() => {
  // getDict()
  let purchaseOrder = formComponent.value?.formInputRef.purchaseOrder.inputRef
  purchaseOrder.focus()
  // dataMap.detailsList[5].supplierConfig = dataMap.ruleForm.supplierConfig
  // console.log( dataMap.detailsList[5].supplierConfig,'选择')
  // dataMap.detailsForm.forEach((item: any, index)=>{
  dataMap.ruleForm.supplierConfig.forEach((item2: any, index2) => {
        item2[`supplierBatch${index2}`] = ''
        item2[`receivingNum${index2}`] = ''
        // item2.supplierBatch = ''
        // item2.receivingNum = ''
      })
    // })
    getDateAuthority()
})
// 获取仓库
async function getDict(val,index) {
  const res = await WMSAPI.get(APIName, { IsPage: false, MaterialsGroup: val.materialsGroup }, 'warehouse/all');
  // await WMSAPI.get(APIName, { IsPage: false,MaterialsGroup:val }, 'warehouse/all').then((res) => {
    if(res.items.length === 0){
      form.value.message = '请在web仓库管理配置物料组!'
      return
    }
    let selectIndex = index
    let array: any[] = []
    array = res.items as []
    array.forEach((item) => {
      item.label = item.warehouseName
      item.value = item.warehouseID
      // console.log(val.region === item.warehouseID)
      if(val.region === item.warehouseID){
        dataMap.detailsForm[selectIndex].wareHouseID = item.warehouseID
      }
    })
    const detailsList = ref(dataMap.detailsForm[index].detailsList)
    detailsList.value[3].options = array
    detailsList.value[3].optionsTwo = JSON.parse(JSON.stringify(array))
    // console.log(detailsList.value[3].options)
    // dataMap.detailsForm[selectIndex].detailsList[3].options =  array
    // dataMap.detailsForm[selectIndex].detailsList[3].optionsTwo = JSON.parse(JSON.stringify(array))
    // console.log(dataMap.detailsForm[selectIndex].detailsList[3].options)
  // })
}
// 获取日期权限
function getDateAuthority(){
  let userInfo = localStorage.getItem('userInfo')
  let text = eval('(' + userInfo + ')')
  WMSAPI.get(APIName, { userName: text.account }, 'pda/GetAuthority').then((res) => {
       if(res.success) dataMap.formList[3].type = 'Calendar'
       else dataMap.formList[3].type = 'Text'
  })
}
dataMap.formList[0].enter = getDetails
// 获取采购订单收货明细
function getDetails() {
  // dataMap.show = true
  WMSAPI.get(APIName, { PO: form.value.purchaseOrder }, 'purchaseorder/GetOrderDetails').then((res) => {
    if (res.success) {
      if(res.data.header.purchOrderType === 'ZC01'){ // 采购单号
      dataMap.detailsForm = res.data.details as any[]
      dataMap.detailsFormClone = JSON.parse(JSON.stringify(dataMap.detailsForm))
      form.value.message = res.message as string
      form.value.supplierName = res.data.header.supplierName as string
      dataMap.supplierCode = res.data.header.supplierCode as string
      dataMap.detailsForm.forEach((item: any, index) => {
        item.quantity === item.receivingQuantity?item.nomenge='':item.nomenge = item.quantity - item.receivingQuantity + "  "+item.unitID // 未收数量
        item.multiLineIndex = index
        item[`multiLine${index}`] = dataMap.ruleForm.supplierConfig
        item.multiLine = JSON.parse(JSON.stringify(dataMap.supplierConfig))
        item.detailsList = JSON.parse(JSON.stringify(dataMap.detailsList))
        getDict(item,index)
        // console.log(item[`multiLine${index}`], 'multiLine数据')
      })
      // console.log( dataMap.detailsForm,'mushu')
      // let arryNew = [];
      // dataMap.ruleForm.supplierConfig.map((item, index) => {
      //      arryNew.push(Object.assign({}, item, { name: item.moduleName }));
      //      return arryNew;
      //  });
      // this.List = arryNew;
      }else {
        form.value.supplierName = res.data.header.supplierName as string
        dataMap.detailsForm = []
        form.value.message = '不属于采购订单号'
      }
    } else {
      form.value.message = res.message as string
    }
  })
}
// dataMap.formList[3].enter = getLocation
// 获取货位编码
function getLocation() {
  WMSAPI.get(APIName, { LocationID: form.value.locID }, 'pda/GetLocationsInfo').then((res) => {
    if (res.success == false || res.success == true) form.value.message = res.message as string
  })
}
dataMap.formList[2].enter = getMaterial
// 获取物料编码（筛选明细）
function getMaterial() {
  if (form.value.materialID) {
    let data = dataMap.detailsForm?.filter((item: any) => {
      let reg = new RegExp(form.value.materialID) //正则模糊搜索
      return reg.test(item.materialID)
    })
    dataMap.detailsForm = data
  } else {
    dataMap.detailsForm = dataMap.detailsFormClone
  }
}
function getSupplierList(val) {
 console.log(val)
 dataMap.multiLineShow = !dataMap.multiLineShow
//  dataMap.multiList = val
}
const addSupplierConfig = (itemIndex) => {
  const newItem = {};
      // 初始化新对象的属性
      dataMap.objectProperties.forEach(prop => {
        newItem[prop] = '';
      });
      dataMap.items[itemIndex].subArray.push(newItem);
  // subArray.push({ supplierBatch: '', receivingNum: '' }); // 添加一个新对象
}
const removeSupplierConfig = (itemIndex, subItemIndex) => {
  // subArray.splice(index, 1); // 移除指定索引的对象
  dataMap.items[itemIndex].multiLine.splice(subItemIndex, 1);
}
function mulineSubmit(){
  dataMap.multiLineShow = false
  console.log(dataMap.detailsForm)
}
function handleInput(itemIndex, subItemIndex, propName) {
// 当输入框的值改变时，将新值更新到其他输入框
const value = this.items[itemIndex].subArray[subItemIndex][propName];
      dataMap.detailsForm.forEach(item => {
        item.multiLine[subItemIndex][propName] = value;
      });
}
// 清除
function handleClear() {
  form.value = {
    date: today,
    warehouse: '',
    purchaseOrder: '',
    supplierName: '',
    locID: '',
    maktx: '',
    message: ''
  }
  dataMap.detailsForm = []
}
// 确定
function handleConfirm() {
  // console.log(dataMap.detailsForm, '11')
  // console.log(dataMap.ruleForm.supplierConfig, 'dataMap.ruleForm.supplierConfig')
  formComponent.value?.refForm.validate().then(() => {
    //   for (let item of dataMap.detailsForm) {
    //    var receivingNum = item.receivingNum
    //    if (receivingNum) {
    //   }
    // }
    dataMap.loading = true
    let userInfo = localStorage.getItem('userInfo')
    let text = eval('(' + userInfo + ')')
    let array: any[] = []
    dataMap.detailsForm.forEach((item: any) => {
      // if (item.receivingNum) {
      array.push({
        poItemNo: item.poItemNo,
        materialID: item.materialID,
        wareHouseID: item.wareHouseID,
        item: item.multiLine
      })
      // } else {
      //   _showFailToast('请输入实收数量！')
      // }
    })
    let data = {
      po: form.value.purchaseOrder,
      wareHouseID: form.value.warehouse,
      receivingDate: form.value.date,
      locationsID: form.value.locID,
      supplierCode: dataMap.supplierCode,
      controlPeople: text.account,
      controlPeopleName: text.name,
      inputMaterial: array
    }
    WMSAPI.post(APIName, data, 'pda/ArriveMaterial').then((res) => {
      if (res.success === true) {
        dataMap.loading = false
        // form.value.message = res.message as string
        form.value = {
          date: today,
          warehouse: '',
          purchaseOrder: '',
          supplierName: '',
          locID: '',
          maktx: '',
          message: res.message as string
        }
        dataMap.detailsForm = []
      } else {
        form.value.message = res.message as string
        dataMap.loading = false
      }
    })
  })
}
</script>
<style scoped>
.form {
  margin-top: 12px;
}

::v-deep .van-cell .van-field {
  padding: 8px !important;
  font-size: 12px;
}
.multiLine .mask
{
width: 100%;
height: 100%;
background: #000;
opacity: .3;
position: fixed;
top: 0;
left: 0;
z-index: 1;
}

.multiLine .pop
{
width: 90%;
height: 16rem;
background: #fff;
/* font-size: 62.5%; */
position: fixed;
top: 50%;
left: 50%;
margin-top: -130px;
margin-left: -169px;
z-index: 10;
}
/* .multiLine {
  width:90%;
  height: 300px;
  background: red;
  z-index: 11111;
} */
</style>
