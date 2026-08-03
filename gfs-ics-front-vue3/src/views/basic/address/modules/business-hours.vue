<template>
  <el-dialog
    title="营业时间"
    :close-on-click-modal="false"
    top="5vh"
    width="70%"
    v-model="visible"
    @close="handleClose"
  >
    <el-row>
      <el-col>
        <el-table
          :data="dataForms"
          border
          highlight-current-row
          stripe
          size="small"
          height="300px"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            fixed="left"
            width="50"
          />
          <el-table-column
            prop="productNumber"
            header-align="center"
            align="center"
            width="100"
            label="星期"
          >
            <template #default="scope">
              {{ weeks[scope.$index].name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="amOperationStartTime"
            header-align="center"
            align="center"
            min-width="200"
            show-overflow-tooltip
            label="上午时间"
          >
            <template #default="scope">
              <el-row>
                <el-col :span="11">
                  <el-time-select
                    placeholder="起始时间"
                    class="w-full"
                    v-model="scope.row.amOperationStartTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '12:00'
                    }"
                  />
                </el-col>
                <el-col :span="2">
                  <span class="h-[35px] leading-[35px]">至</span>
                </el-col>
                <el-col :span="11">
                  <el-time-select
                    placeholder="结束时间"
                    class="w-full"
                    v-model="scope.row.amOperationEndTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '12:00',
                      minTime: scope.row.amOperationStartTime
                    }"
                  />
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="pmOperationStartTime"
            header-align="center"
            align="center"
            min-width="200"
            show-overflow-tooltip
            label="下午时间"
          >
            <template #default="scope">
              <el-row>
                <el-col :span="11">
                  <el-time-select
                    placeholder="起始时间"
                    class="w-full"
                    v-model="scope.row.pmOperationStartTime"
                    :picker-options="{
                      start: '12:00',
                      step: '00:30',
                      end: '24:00'
                    }"
                  />
                </el-col>
                <el-col :span="2" style="align-content: center">
                  <span class="h-[35px] leading-[35px]">至</span>
                </el-col>
                <el-col :span="11">
                  <el-time-select
                    placeholder="结束时间"
                    class="w-full"
                    v-model="scope.row.pmOperationEndTime"
                    :picker-options="{
                      start: '12:00',
                      step: '00:30',
                      end: '24:00',
                      minTime: scope.row.pmOperationStartTime
                    }"
                  />
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            prop="quantity"
            header-align="center"
            align="center"
            min-width="100"
            label="备注"
          >
            <template #default="scope">
              <el-input size="small" v-model="scope.row.remark" placeholder="备注" />
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="mt-4">
      <el-col :span="6" :offset="18">
        <el-button :loading="submitButton" type="info" @click="quickAssignment()">一键赋值</el-button>
        <el-button :loading="submitButton" type="primary" @click="submitHandle()">保存</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getInfoByAddressId, addOrUpdate } from '@/service/api/mdm/address-business-hours';

const emit = defineEmits(['refreshDataList']);

const visible = ref(false);
const dataListSelections = ref<any[]>([]);
const weeks = ref([
  {
    week: 0,
    name: "周日"
  },
  {
    week: 1,
    name: "周一"
  },
  {
    week: 2,
    name: "周二"
  },
  {
    week: 3,
    name: "周三"
  },
  {
    week: 4,
    name: "周四"
  },
  {
    week: 5,
    name: "周五"
  },
  {
    week: 6,
    name: "周六"
  }
]);
const dataForms = ref<any[]>([]);
const submitButton = ref(false);

// 一键赋值
function quickAssignment() {
  const selectList = dataListSelections.value;
  const dataList = dataForms.value;
  if(selectList.length === 1) {
    if(!selectList[0].amOperationEndTime && !selectList[0].amOperationStartTime && !selectList[0].pmOperationEndTime && !selectList[0].pmOperationStartTime) {
      ElMessage.warning('该模板营业时间未维护!');
    } else {
      dataList.forEach((value, index) => {
        if(!value.amOperationEndTime && !value.amOperationStartTime && !value.pmOperationEndTime && !value.pmOperationStartTime) {
          dataForms.value[index].amOperationStartTime = selectList[0].amOperationStartTime;
          dataForms.value[index].amOperationEndTime = selectList[0].amOperationEndTime;
          dataForms.value[index].pmOperationStartTime = selectList[0].pmOperationStartTime;
          dataForms.value[index].pmOperationEndTime = selectList[0].pmOperationEndTime;
        }
      });
    }
  } else if(selectList.length === 0) {
    ElMessageBox.confirm('您未选择赋值模板，将默认赋值：08:00-12:00,12:00-18:00', '请确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      dataList.forEach((value, index) => {
        if(!value.amOperationEndTime && !value.amOperationStartTime && !value.pmOperationEndTime && !value.pmOperationStartTime) {
          dataForms.value[index].amOperationStartTime = '08:00';
          dataForms.value[index].amOperationEndTime = '12:00';
          dataForms.value[index].pmOperationStartTime = '12:00';
          dataForms.value[index].pmOperationEndTime = '18:00';
        }
      });
    });
  } else {
    ElMessage.warning('仅能选择一条营业时间维护模板!');
  }
}

// 多选
function selectionChangeHandle(val: any[]) {
  dataListSelections.value = val;
}

// 保存处理
async function submitHandle() {
  submitButton.value = true;
  try {
    const { response } = await addOrUpdate(dataForms.value);
    submitButton.value = false;
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      ElMessage.success(response.data.msg || '操作成功');
      submitButton.value = false;
      visible.value = false;
    }
  } catch (error) {
    console.error(error);
    submitButton.value = false;
  }
}

// 初始化
async function init(addressId: string | number) {
  visible.value = true;

  // 初始化数据
  for(let i = 0; i < weeks.value.length; i++) {
    dataForms.value.push(
      {
        id: null,
        addressId: addressId,
        week: weeks.value[i].week,
        amOperationStartTime: '',
        amOperationEndTime: '',
        pmOperationStartTime: '',
        pmOperationEndTime: '',
        remark: null,
      }
    );
  }

  if(addressId) {
    nextTick(() => {
      dataForms.value.forEach(item => {
        item.addressId = addressId;
      });
    });

    await getInfoByAddressIdHandle(addressId);
  }
}

// 根据地址ID获取信息
async function getInfoByAddressIdHandle(addressId: string | number) {
  try {
    const { response } = await getInfoByAddressId(addressId);
    if(response && response.data && Array.isArray(response.data) && response.data.length > 0) {
      dataForms.value = response.data;
    }
  } catch (error) {
    console.error(error);
  }
}

// 关闭处理
function handleClose() {
  dataForms.value = [];
}

defineExpose({ init });
</script>

<style scoped>
</style>