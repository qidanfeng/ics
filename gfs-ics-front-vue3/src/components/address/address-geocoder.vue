<template>
  <el-dialog
    title="地址解析"
    :close-on-click-modal="false"
    top="2vh"
    width="90%"
    v-model="visible"
    @close="handleClose"
  >
    <el-row>
      <el-col>
        <el-form :model="form" ref="formRef" size="small">
          <el-form-item prop="addressStr" :rules="[{ required: true, message: '请至少输入一个地址'}]">
            <el-input 
              v-model="form.addressStr" 
              @blur="blur()"
              type="textarea" 
              :autosize="{ minRows: 10, maxRows: 10}" 
              placeholder="请输入要解析的地址，每个地址占一行"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            平台：
            <el-radio 
              :disabled="submitButton || result.length>0" 
              v-model="platform" 
              label="bd"
            >
              百度
            </el-radio>
            坐标系：
            <el-select 
              :disabled="submitButton || result.length>0" 
              v-model="locationType" 
              placeholder="请选择坐标系"
            >
              <el-option
                v-for="item in locationTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-divider direction="vertical"></el-divider>
            <el-button 
              :loading="submitButton" 
              :disabled="submitButton || result.length>0" 
              type="success" 
              @click="geocoder()" 
              icon="el-icon-s-tools"
            >
              解析<span v-if="form.addressStr && form.addressStr.length>0">&nbsp;{{result.length+'/'+addressArr.length}}</span>
            </el-button>
            <el-button @click="result = []" icon="el-icon-delete-solid">清空结果</el-button>
            <el-button @click="downloadResults()" type="success" icon="el-icon-upload">导出</el-button>
            <el-button 
              @click="form.addressStr = null;result = [];submitButton=false" 
              type="danger" 
              icon="el-icon-refresh-right"
            >
              重置
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-tag size="small" color="white" effect="dark"></el-tag>&nbsp;可信&nbsp;&nbsp;
            <el-tag size="small" color="#FFC0CB" effect="dark"></el-tag>&nbsp;可信度较低&nbsp;&nbsp;
            <el-tag size="small" color="#FF7F50" effect="dark"></el-tag>&nbsp;可信度极低&nbsp;&nbsp;
            <el-tag size="small" color="#FF6347" effect="dark"></el-tag>&nbsp;不可信
          </el-form-item>
          <el-form-item v-if="submitButton || result.length>0">
            <span><i class='el-icon-s-data'></i>&nbsp;结果：{{scoreMsg}}</span>
            <el-rate 
              v-model="value" 
              disabled 
              show-score 
              text-color="#ff9900" 
              score-template="{value}" 
              style="display:inline"
            ></el-rate>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table 
        ref="tableRef" 
        size="small" 
        border 
        fit 
        :data="result" 
        :max-height="windowHeight" 
        style="width: 100%" 
        :row-style="rowStyle"
      >
        <el-table-column sortable align="center" prop="index" label="#" min-width="50">
          <template #default="scope">
            {{ scope.row.index+1 }}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="250">
          <template #default="scope">
            <template v-if="!scope.row.edit">
              <div v-if="scope.row.confidence && scope.row.confidence <= 50" @click="scope.row.edit = true">
                <i class="el-icon-edit"></i>
                <span style="margin-left: 10px">{{ scope.row.address }}</span>
              </div>
              <div v-else>
                {{ scope.row.address }}
              </div>
            </template>
            <template v-else>
              <el-input 
                v-model="scope.row.address" 
                type="textarea" 
                :autosize="{ minRows: 1, maxRows: 3 }" 
                size="small"  
                maxlength="30" 
                style="padding-right: 55px; font-size: 12px"
              ></el-input>
              <el-button
                style="position: absolute; right: 10px; top: 2px"
                size="small"
                type="text"
                @click="editGeocoder(scope.row.address,scope.row.index)"
              >
                重新解析
              </el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="resultAddress" label="解析地址" min-width="250"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="province" label="省" min-width="60"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="city" label="市" min-width="60"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="district" label="区" min-width="60"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="level" label="level" min-width="60"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="lng" label="经度" min-width="100"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="lat" label="纬度" min-width="100"></el-table-column>
        <el-table-column align="center" prop="confidence" sortable label="可信度" min-width="60"></el-table-column>
        <el-table-column align="center" prop="locationType" label="坐标系" min-width="60"></el-table-column>
        <el-table-column
          align="center"
          min-width="120"
        >
          <template #header>
            <span>操作</span>
            <el-tooltip placement="top">
              <template #content>
                地址解析默认使用百度地址解析，需要详细到街道，否则可能会有误差；<br>
                智慧搜索默认取结果集中的第一个；<br>
                智慧搜索由于搜索范围比较大，误差比较大；<br>
                智慧搜索仅在默认解析无法准确定位的情况下使用，不推荐使用；
              </template>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-button 
              :loading="scope.row.editLoading" 
              style="color: #909399" 
              type="text" 
              size="small" 
              @click="editGeocoder(scope.row.address,scope.row.index)"
            >
              重新解析
            </el-button>
            <el-button 
              :loading="scope.row.searchLoading" 
              style="color: #F56C6C" 
              type="text" 
              size="small" 
              @click="localSearch(scope.row.address,scope.row.index)"
            >
              智慧搜索
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
// 暂时使用模拟函数替代
const download = (data: any, filename: string) => {
  console.log('Download function called with:', data, filename);
  // 实际实现需要根据项目结构添加
};
const bd09togcj02 = (lng: number, lat: number) => [lng, lat]; // 模拟函数
const bd09towgs84 = (lng: number, lat: number) => [lng, lat]; // 模拟函数

// 响应式数据
const value = ref(0);
const scoreMsg = ref<string | null>(null);
const windowHeight = ref(document.documentElement.clientHeight - 440);
const visible = ref(false);
const result = ref<any[]>([]);
const form = ref({
  addressStr: null as string | null
});
const addressArr = ref<string[]>([]);
const submitButton = ref(false);
const platform = ref('bd');
const locationType = ref('BD-09');

// 坐标系类型
const locationTypes = ref([
  {
    value: 'BD-09',
    label: 'BD-09（百度，目前系统默认坐标系）'
  },
  {
    value: 'GCJ-02',
    label: 'GCJ-02（中国国家测绘局标准坐标系）'
  },
  {
    value: 'WGS-84',
    label: 'WGS-84（GPS全球定位系统标准坐标系）'
  }
]);

// 引用
const formRef = ref();
const tableRef = ref();

// 初始化方法
const init = () => {
  visible.value = true;
};

// 关闭处理
const handleClose = () => {
  submitButton.value = false;
};

// 失焦处理
const blur = () => {
  // 去空格
  if (form.value.addressStr) {
    form.value.addressStr = form.value.addressStr.replace(/\s/g, '');
  }
  // 根据换行符分割成多个地址
  addressArr.value = [];
  const arr = (form.value.addressStr || '').split('\n');
  addressArr.value = arr.filter(item => item.trim() !== '');
  form.value.addressStr = addressArr.value.join("\n");
};

// 结果排序
const resultSort = () => {
  result.value.sort((a, b) => a.index - b.index);
};

// 下载结果
const downloadResults = () => {
  if (result.value.length === 0) {
    ElMessage.warning('没有可导出的内容！');
    return;
  }
  resultSort();
  const jsonData = result.value.map(item => ({
    '序号': item.index + 1,
    '原地址': item.address,
    '解析地址': item.resultAddress,
    '省': item.province,
    '市': item.city,
    '区': item.district,
    '经度': item.lng,
    '纬度': item.lat,
    '可信度': item.confidence,
    '级别': item.level,
    '坐标系': item.locationType
  }));
  download(jsonData, '地址解析结果.xlsx');
};

// 地址解析
const geocoder = () => {
  // 这里简化处理，实际需要根据具体的API和业务逻辑来实现
  // 原来的逻辑涉及百度地图API，需要根据实际情况调整
};

// 本地搜索
const localSearch = (address: string, index: number) => {
  if (!address || address.trim() === '') {
    ElMessage.warning('地址不能为空！');
    return;
  }
  // 模拟本地搜索逻辑
  console.log('Local search for:', address, 'at index:', index);
};

// 编辑地址解析
const editGeocoder = (address: string, index: number) => {
  if (!address || address.trim() === '') {
    ElMessage.warning('地址不能为空！');
    return;
  }
  // 模拟编辑解析逻辑
  console.log('Edit geocoder for:', address, 'at index:', index);
};

// 行样式
const rowStyle = ({ row }: { row: any }) => {
  if (row.confidence) {
    if (row.confidence <= 20) {
      return { 'background': '#FF6347 !important' };
    } else if (row.confidence <= 30) {
      return { 'background': '#FF7F50 !important' };
    } else if (row.confidence <= 50) {
      return { 'background': '#FFC0CB !important' };
    } else {
      return {};
    }
  }
  return {};
};

// 定义事件
const emit = defineEmits(['refresh-data-list']);

// 暴露方法给父组件
defineExpose({
  init
});

// 监听窗口大小变化
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  windowHeight.value = document.documentElement.clientHeight - 440;
};
</script>

<style scoped>
/* 可以根据需要添加样式 */
</style>