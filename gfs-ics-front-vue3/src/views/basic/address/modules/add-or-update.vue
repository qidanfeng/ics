<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    v-model="innerVisible"
    @close="closeHandle"
    top="9vh"
    width="90%"
  >
    <el-form
      :model="dataForm"
      label-position="right"
      :rules="dataRule"
      ref="dataFormRef"
      label-width="100px"
      inline
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户" prop="clientCode" class="w-full">
            <el-select
              v-model="dataForm.clientCode"
              placeholder="客户"
              @change="clientChangeHandle"
              filterable
              clearable
              class="w-full"
            >
              <el-option
                v-for="item in clientList"
                :key="item.code"
                :label="item.cnName"
                :value="item.code"
              >
                <div class="flex justify-between items-center w-full">
                  <span>{{ item.code }}</span>
                  <span class="text-xs text-gray-400">{{ item.cnName }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="货主" prop="customerCode" class="w-full">
            <el-select
              v-model="dataForm.customerCode"
              placeholder="货主"
              @change="customerChangeHandle"
              filterable
              clearable
              class="w-full"
            >
              <el-option
                v-for="item in customerList"
                :key="item.code"
                :label="item.shortName"
                :value="item.code"
              >
                <span class="float-left">{{ item.code }}</span>
                <span class="float-right text-xs text-gray-400">{{ item.shortName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="地址代码" prop="code" class="w-full">
            <el-input
              v-model="dataForm.code"
              :disabled="!!dataForm.id || alreadyExistsFlag"
              placeholder="地址代码"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="地址名称" prop="name" class="w-full">
            <el-input v-model="dataForm.name" placeholder="地址名称" class="w-full" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="地址类型" prop="inOut" class="w-full">
            <div class="flex items-center">
              <el-select
                class="w-full"
                v-model="dataForm.inOut"
                placeholder="地址类型"
                @change="addressTypeHandleChange"
                filterable
                clearable
              >
                <el-option
                  v-for="item in addressType"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-tooltip placement="top" effect="light" class="ml-2">
                <template #content>
                  <div>
                    当此地址为内部地址，且是中转点时，此地址代表普冷仓库，将参与逻辑运算
                  </div>
                </template>
                <el-icon class="cursor-pointer"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="地址属性" prop="propertyDictionaryName" class="w-full">
            <el-select
              class="w-full"
              v-model="dataForm.propertyDictionaryName"
              placeholder="地址属性"
              @change="addressPropertyHandleChange"
              filterable
              clearable
            >
              <el-option
                v-for="item in addressProperty"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="省-市-区" prop="province" class="w-full">
            <el-cascader
              class="w-full"
              :key="fromOptionKey"
              :options="fromOptions"
              v-model="fromSelectedOptions"
              :props="props"
              :placeholder="!dataForm.province && !dataForm.city && !dataForm.area ? '省市区' :
              ((dataForm.province ? dataForm.province : '')  + ' / ' +
              (dataForm.city ? dataForm.city : '') + ' / ' +
              (dataForm.area ? dataForm.area : ''))"
              ref="fromCascader"
              clearable
              @change="(value: any) => fromHandleChange(value)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址" prop="detailedAddress" class="w-full">
            <el-input
              :disabled="!dataForm.detailedAddress"
              v-model="dataForm.detailedAddress"
              placeholder="详细地址"
              class="w-full"
            >
              <template #append>
                <el-button @click="getGpsList()">
                  <el-icon><Location /></el-icon>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="经度" prop="longitude" class="w-full">
            <el-input
              disabled
              v-model="dataForm.longitude"
              placeholder="经度"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纬度" prop="latitude" class="w-full">
            <el-input
              disabled
              v-model="dataForm.latitude"
              placeholder="纬度"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人" prop="linkMan" class="w-full">
            <el-input v-model="dataForm.linkMan" placeholder="联系人" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="联系人手机" prop="linkManPhone" class="w-full">
            <el-input v-model="dataForm.linkManPhone" placeholder="联系人手机" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人电话" prop="linkManTelephone" class="w-full">
            <el-input v-model="dataForm.linkManTelephone" placeholder="联系人电话" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人邮箱" prop="linkManEmail" class="w-full">
            <el-input v-model="dataForm.linkManEmail" placeholder="联系人邮箱" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="抄送人邮箱" prop="extractsManEmail" class="w-full">
            <el-input v-model="dataForm.extractsManEmail" placeholder="抄送人邮箱" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="提货点" prop="pickUpPointFlag" class="w-full">
            <el-radio-group v-model="dataForm.pickUpPointFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="中转点" prop="transitPointFlag" class="w-full">
            <el-radio-group v-model="dataForm.transitPointFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="送货点" prop="deliveryPointFlag" class="w-full">
            <el-radio-group v-model="dataForm.deliveryPointFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="装卸货预约" prop="bookingFlag" class="w-full">
            <el-radio-group v-model="dataForm.bookingFlag">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="路线代码" prop="routesCode" class="w-full">
            <el-input v-model="dataForm.routesCode" placeholder="路线代码" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="路线名称" prop="routesName" class="w-full">
            <el-input v-model="dataForm.routesName" placeholder="路线名称" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="路顺" prop="routesSequence" class="w-full">
            <el-input v-model="dataForm.routesSequence" placeholder="路顺" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="播种顺序" prop="sowSequence" class="w-full">
            <el-input v-model="dataForm.sowSequence" placeholder="播种顺序" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="电子围栏范围" prop="fenceScope" class="w-full">
            <el-input v-model="dataForm.fenceScope" placeholder="电子围栏范围" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预留字段1" prop="extendFirst" class="w-full">
            <el-input v-model="dataForm.extendFirst" placeholder="预留字段1" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预留字段2" prop="extendSecond" class="w-full">
            <el-input v-model="dataForm.extendSecond" placeholder="预留字段2" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="预留字段3" prop="extendThird" class="w-full">
            <el-input v-model="dataForm.extendThird" placeholder="预留字段3" class="w-full" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注" prop="remark" class="w-full">
            <el-input v-model="dataForm.remark" placeholder="备注" class="w-full" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="innerVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="dataFormSubmit()" :loading="submitButton">确 定</el-button>
      </span>
    </template>

    <el-drawer
      :title="map.title"
      v-model="mapDialog"
      :append-to-body="true"
      size="60%"
      :before-close="drawerClose"
      direction="ltr"
    >
      <div style="display: flex; flex-direction: column; height: 100%;">
        <el-row style="margin-bottom: 10px; flex-shrink: 0;">
          <el-col :span="10">
            <el-select
              class="w-full"
              v-model="map.detailAddress"
              placeholder="输入地址搜索或点击地图选择"
              filterable
              clearable
              remote
              :remote-method="mapQueryHandle"
              @change="mapChangeHandle"
              size="default"
            >
              <el-option
                v-for="item in map.suggestions"
                :key="item.detailUrl"
                :label="item.title + ' - ' + item.address"
                :value="item.address"
              />
            </el-select>
          </el-col>
          <el-col :span="12" style="padding-left: 10px;">
            <el-input class="w-full" placeholder="经纬度" v-model="map.coordinate" disabled></el-input>
          </el-col>
          <el-col :span="2" style="padding-left: 10px;">
            <el-button class="w-full" type="primary" @click="mapSubmit(map.type)">确定</el-button>
          </el-col>
        </el-row>
        <div id="addressContainer" style="width: 100%; flex: 1; min-height: 0;"></div>
      </div>
    </el-drawer>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { QuestionFilled, Location } from '@element-plus/icons-vue';
import { info, addOrUpdate, queryAddressType } from '@/service/api/mdm/address';
import { queryActivatedOwnClientInfo } from '@/service/api/mdm/client';
import { getActivatedProjectByClient } from '@/service/api/mdm/project';
import { queryByParentType } from '@/service/api/mdm/dictionary';
import { getProvince as getProvinceApi, getAreasByParentCode } from '@/service/api/mdm/dt-area-mapping';
import * as echarts from 'echarts';
import {
  loadBaiduMap,
  initBaiduMap,
  createMarker,
  reverseGeocode,
  geocode,
  localSearch
} from '@/utils/baiduMapLoader';

// 定义props，支持v-model
interface Props {
  visible?: boolean;
}

const componentProps = withDefaults(defineProps<Props>(), {
  visible: false
});

const emit = defineEmits(['refreshDataList', 'update:visible']);

const dataFormRef = ref();
const innerVisible = ref(false);
const chartRef = ref();
let myChart: echarts.ECharts | null = null;

// 监听props变化同步到内部状态
watch(
  () => componentProps.visible,
  (newVal) => {
    innerVisible.value = newVal;
  },
  { immediate: true }
);

// 监听内部状态变化并同步到父组件
watch(innerVisible, (newVal) => {
  if (newVal !== componentProps.visible) {
    emit('update:visible', newVal);
  }

});
const submitButton = ref(false);
const alreadyExistsFlag = ref(false);
const addOrUpdateFlag = ref(false);

// 地图相关
const mapDialog = ref(false);
const marker: any = ref(null);
const mapInit: any = ref(null);
const map = ref<any>({
  type: '',
  area: '',
  detailAddress: '',
  coordinate: '',
  longitude: null,
  latitude: null,
  title: '',
  point: null,
  suggestions: []
});

// 级联选择器相关
const fromCascader = ref();
const fromOptionKey = ref(0);
const fromOptions = ref<any[]>([]);
const props = {
  checkStrictly: true,
  lazy: true,
  lazyLoad(node: any, resolve: any) {
    let level = node.level;
    let parentCode = node.value;
    let existChildren: any[] = [];
    if (node && node.children && node.children.length) {
      existChildren = node.children.map((item: any) => item.label + '#' + item.value);
    }
    if (level === 0) {
      getProvinceApi().then(({ response }: any) => {
        if (response && response.data && (response.data.code as unknown as number) === 0) {
          let provinceList = response.data.data;
          const nodes = provinceList.map((item: any) => ({
            value: item.areaCode,
            label: item.areaName,
            leaf: level > 1
          }));
          resolve(nodes);
        }
      })
    } else if (!existChildren.length) {
      getAreasByParentCode(parentCode).then(({ response }: any) => {
        if (response && response.data && (response.data.code as unknown as number) === 0) {
          let areaList = response.data.data;
          const nodes = areaList.map((item: any) => ({
            value: item.areaCode,
            label: item.areaName,
            leaf: level > 1
          }));
          resolve(nodes);
        }
      })
    } else {
      const nodes: any[] = [];
      resolve(nodes);
    }
  }
};
const fromSelectedOptions = ref<any[]>([]);

// 数据列表
const clientList = ref<any[]>([]);
const customerList = ref<any[]>([]);
const addressProperty = ref<any[]>([]);
const addressType = ref<any[]>([]);

const dataForm: any = reactive({
  id: 0,
  code: '',
  name: '',
  clientCode: '',
  clientName: '',
  customerCode: '',
  customerName: '',
  parentCode: '',
  province: '',
  city: '',
  area: '',
  provinceCode: '',
  cityCode: '',
  areaCode: '',
  detailedAddress: '',
  linkMan: '',
  linkManPhone: '',
  linkManTelephone: '',
  linkManEmail: '',
  extractsManEmail: '',
  propertyDictionaryId: '',
  propertyDictionaryName: '',
  inOut: '',
  remark: '',
  extendFirst: '',
  extendSecond: '',
  extendThird: '',
  status: true,
  pickUpPointFlag: 0,
  transitPointFlag: 0,
  deliveryPointFlag: 0,
  longitude: null,
  latitude: null,
  addressZoneId: null,
  unloadPrior: null,
  loadPrior: null,
  mixFlag: 0,
  bookingFlag: 0,
  grade: null,
  maxEqmtHeight: null,
  maxEqmtLength: null,
  maxEqmtWidth: null,
  fenceScope: 9999,
  routesCode: null,
  routesName: null,
  routesSequence: null,
  sowSequence: null,
  createdBy: null,
  createdTime: null,
  lastModifiedBy: null,
  lastModifiedTime: null,
  dtAreaId: null,
  dtAreaOmsMnemonicCode: '',
  addOrUpdate: false,
  companyId: null,
  companyType: null,
  companyCnName: null
});

const dataRule = {
  code: [
    { required: true, message: '地址代码不能为空', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '地址名称不能为空', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请选择省市区'}
  ],
  detailedAddress: [
    { required: true, message: '请输入详细地址信息', trigger: 'blur' }
  ],
  longitude: [
    { required: true, message: '经度不能为空', trigger: 'blur' }
  ],
  latitude: [
    { required: true, message: '纬度不能为空', trigger: 'blur' }
  ],
  linkMan: [
    { required: true, message: '联系人不能为空', trigger: 'blur' }
  ],
  linkManPhone: [
    { required: true, message: '联系人手机不能为空', trigger: 'blur' }
  ],
  inOut: [
    { required: true, message: '地址类型不能为空'}
  ]
};

// 初始化函数
async function init(id?: string | number) {
  innerVisible.value = true;
  dataForm.id = id || 0;
  await queryProperty();
  await getProvince();
  await getAddressType();
  await getActivatedUserOwnClientHandle();

  nextTick(async () => {
    if(id) {
      addOrUpdateFlag.value = true;
      alreadyExistsFlag.value = true;
      try {
        const { response } = await info(id);
        if (response && response.data && (response.data.code as unknown as number) === 0) {
          Object.assign(dataForm, response.data.data);

          // 设置级联选择器的值
          fromSelectedOptions.value = [];
          if(dataForm.provinceCode) {
            fromSelectedOptions.value.push(parseFloat(String(dataForm.provinceCode)));
          }
          if(dataForm.cityCode) {
            fromSelectedOptions.value.push(parseFloat(String(dataForm.cityCode)));
          }
          if(dataForm.areaCode) {
            fromSelectedOptions.value.push(parseFloat(String(dataForm.areaCode)));
          }

          if (dataForm.clientCode) {
            const client = clientList.value.find(item => item.code === dataForm.clientCode);
            if (client) {
              const projectResponse = await getActivatedProjectByClient(client.id);
              if (projectResponse.response && projectResponse.response.data && (projectResponse.response.data.code as unknown as number) === 0) {
                customerList.value = projectResponse.response.data.data || [];
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // 新增模式下，清空省市区相关字段
      dataForm.province = '';
      dataForm.city = '';
      dataForm.area = '';
      dataForm.provinceCode = '';
      dataForm.cityCode = '';
      dataForm.areaCode = '';

      // 清空级联选择器
      fromSelectedOptions.value = [];

      // 重置其他相关字段
      dataForm.detailedAddress = '';
      dataForm.longitude = null;
      dataForm.latitude = null;

      addOrUpdateFlag.value = false;
      alreadyExistsFlag.value = false;
    }
  });
}

// 关闭处理
function closeHandle() {
  nextTick(() => {
    emit('refreshDataList');
    clearDataForm();
    innerVisible.value = false;
    addOrUpdateFlag.value = false;
    alreadyExistsFlag.value = false;
  });
}

// 清空表单
function clearDataForm() {
  dataFormRef.value?.resetFields();
  fromOptions.value = [];
  fromSelectedOptions.value = [];
  clientList.value = [];
  customerList.value = [];
  drawerClose();
  dataForm.companyCnName = '';
  dataForm.companyId = null;

  // 清空省市区相关字段
  dataForm.province = '';
  dataForm.city = '';
  dataForm.area = '';
  dataForm.provinceCode = '';
  dataForm.cityCode = '';
  dataForm.areaCode = '';

  // 清空级联选择器
  fromSelectedOptions.value = [];
}

// 获取地址属性
async function queryProperty() {
  try {
    const types = ["address_property"];
    const { response } = await queryByParentType(types);
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      addressProperty.value = response.data.data["address_property"] || [];
      if (!dataForm.id && addressProperty.value.length > 0) {
        dataForm.propertyDictionaryId = addressProperty.value[0].id;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// 获取地址类型
async function getAddressType() {
  try {
    const { response } = await queryAddressType();
    if(response && response.data && (response.data.code as unknown as number) === 0) {
      addressType.value = response.data.data || [];
    }
  } catch (error) {
    console.error(error);
  }
}

// 获取省份
async function getProvince() {
  try {
    const provResponse = await getProvinceApi();
    if (provResponse.response && provResponse.response.data && (provResponse.response.data.code as unknown as number) === 0) {
      fromSelectedOptions.value = provResponse.response.data.data || [];
    }
  } catch (error) {
    console.error(error);
  }
}

// 获取客户列表
async function getActivatedUserOwnClientHandle() {
  try {
    const { response } = await queryActivatedOwnClientInfo();
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      clientList.value = response.data.data || [];
    } else {
      clientList.value = [];
    }
  } catch (error) {
    console.error(error);
  }
}

// 客户变更处理
function clientChangeHandle(val: string) {
  if(val) {
    const client = clientList.value.find(item => item.code === val);
    if(client) {
      dataForm.clientCode = client.code;
      dataForm.clientName = client.cnName;
      getProjectListByClientIdHandle(client.id);
    }
  } else {
    dataForm.clientCode = '';
    dataForm.clientName = '';
  }
  dataForm.customerCode = '';
  dataForm.customerName = '';
  customerList.value = [];
}

// 根据客户ID获取项目列表
async function getProjectListByClientIdHandle(clientId: string | number) {
  customerList.value = [];
  dataForm.customerCode = null;

  if (clientId) {
    try {
      const { response } = await getActivatedProjectByClient(clientId);
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        customerList.value = response.data.data || [];
        if(customerList.value.length === 1) {
          dataForm.customerCode = customerList.value[0].code;
          dataForm.customerName = customerList.value[0].shortName;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}

// 货主变更处理
function customerChangeHandle(val: string) {
  if(val) {
    const customer = customerList.value.find(item => item.code === val);
    if(customer) {
      dataForm.customerCode = customer.code;
      dataForm.customerName = customer.shortName;
    }
  } else {
    dataForm.customerCode = "";
    dataForm.customerName = "";
  }
}

// 地址类型变更处理
function addressTypeHandleChange(val: string) {
  if (val) {
    const addrType = addressType.value.find(it => it.value === val);
    if(addrType) {
      dataForm.inOut = addrType.value;
    }
  }
}

// 地址属性变更处理
function addressPropertyHandleChange(val: string) {
  if (val) {
    const prop = addressProperty.value.find(it => it.name === val);
    if(prop) {
      dataForm.propertyDictionaryId = prop.id;
      dataForm.propertyDictionaryName = prop.name;
    }
  }
}

// 省市区级联变更处理
function fromHandleChange(value: any[]) {
  let labels: string[] = [];
  if (value.length) {
    try {
      labels = (fromCascader.value as any)?.getCheckedNodes()[0]?.pathLabels || [];
    } catch (e) {
      console.warn('无法获取级联标签:', e);
    }
  }
  dataForm.provinceCode = value[0] ? value[0] : null;
  dataForm.cityCode = value[1] ? value[1] : null;
  dataForm.areaCode = value[2] ? value[2] : null;
  dataForm.province = labels[0] ? labels[0] : null;
  dataForm.city = labels[1] ? labels[1] : null;
  dataForm.area = labels[2] ? labels[2] : null;
}

// 地图相关函数
function drawerClose() {
  mapInit.value = null;
  marker.value = null;
  map.value = {
    type: '',
    area: '',
    detailAddress: '',
    coordinate: '',
    longitude: null,
    latitude: null,
    title: '',
    point: null,
    suggestions: null
  };
  mapDialog.value = false;
}

function getGpsList() {
  let area = '';
  const defaultArea = '中国';

  // 不强制要求选择省市区，如果没有选择，则使用默认值
  if(fromSelectedOptions.value == null || fromSelectedOptions.value.length === 0) {
    area = defaultArea;
  } else {
    // 如果选择了省市区，使用选择的区域
    area = dataForm.area == null ? (dataForm.city == null ? (dataForm.province == null ? defaultArea : (dataForm.province == '全部' ? defaultArea : dataForm.province)) : (dataForm.city == '全部' ? dataForm.province : dataForm.city)) : (dataForm.area == '全部' ? dataForm.city : dataForm.area);
    // 处理特殊 '市辖区'
    if(area === '市辖区') {
      area = dataForm.province;
    }
  }

  if(dataForm.detailedAddress && dataForm.detailedAddress !== "") {
    map.value.detailAddress = dataForm.detailedAddress;
    map.value.longitude = Number(dataForm.longitude);
    map.value.latitude = Number(dataForm.latitude);
    map.value.point = { lng: Number(dataForm.longitude), lat: Number(dataForm.latitude) };
    map.value.coordinate = dataForm.longitude + ',' + dataForm.latitude;
  }

  map.value.title = '提货地 区域【' + area + '】';
  map.value.area = area;

  // 显示地图弹窗
  mapDialog.value = true;

  // 使用nextTick确保弹窗DOM已渲染
  nextTick(async () => {
    try {
      console.log('开始加载百度地图 GL 版本...');
      console.log('当前 BMapGL 状态:', typeof (window as any).BMapGL);

      // 确保百度地图已加载
      await loadBaiduMap();

      // 检查 BMapGL 是否可用
      if (typeof (window as any).BMapGL === 'undefined') {
        console.error('BMapGL 未定义，等待2秒后重试...');
        // 等待2秒后再次检查
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (typeof (window as any).BMapGL === 'undefined') {
          throw new Error('BMapGL 对象未找到，请检查网络连接或AK配置');
        }
      }

      console.log('BMapGL 已就绪，开始初始化地图实例');
      // 初始化地图
      await initBaiduMapInternal();
    } catch (error: any) {
      console.error('地图初始化失败:', error);
      ElMessage.error(error?.message || '地图服务加载失败，请刷新页面重试');
    }
  });
}

// 设置地图坐标
async function setMap(point: any) {

  // 更新坐标信息
  map.value.longitude = point.lng;
  map.value.latitude = point.lat;
  map.value.coordinate = point.lng + ',' + point.lat;

  // 清空搜索建议，表示这是通过点击选择的
  map.value.suggestions = [];


  // 使用逆地理编码获取详细地址
  try {
    const result = await reverseGeocode(point.lng, point.lat);

    // GL 版本返回的数据结构：result.address
    if (result && result.address) {
      map.value.detailAddress = result.address;
    } else {
      console.error('setMap: result 中没有 address 字段', result);
      map.value.detailAddress = `坐标: ${point.lng}, ${point.lat}`;
    }
  } catch (error) {
    console.error('setMap: 逆地理编码失败:', error);
    // 使用坐标作为地址
    map.value.detailAddress = `坐标: ${point.lng}, ${point.lat}`;
  }
}

// 内部地图初始化函数
async function initBaiduMapInternal() {
  try {

    // 检查 BMapGL 是否可用
    const BMapGL = (window as any).BMapGL;
    if (!BMapGL) {
      throw new Error('BMapGL 未加载，请检查网络连接');
    }

    // 等待地图容器元素渲染完成
    const container = document.getElementById("addressContainer");
    if (!container) {
      throw new Error('地图容器元素未找到');
    }

    // 使用统一的初始化函数
    if (map.value.detailAddress && map.value.longitude && map.value.latitude) {
      // 如果有详细地址，使用该地址作为中心点
      mapInit.value = initBaiduMap("addressContainer", {
        center: { lng: map.value.longitude, lat: map.value.latitude },
        zoom: 18
      });

      // 创建标注
      marker.value = createMarker(mapInit.value, { lng: map.value.longitude, lat: map.value.latitude });

      // 延迟调整地图中心，确保容器尺寸已稳定
      setTimeout(() => {
        if (mapInit.value) {
          mapInit.value.resize();
          const point = new BMapGL.Point(map.value.longitude, map.value.latitude);
          mapInit.value.centerAndZoom(point, 18);
        }
      }, 300);
    } else if (map.value.area) {
      // 否则使用省市区名称，需要进行地理编码
      mapInit.value = initBaiduMap("addressContainer", {
        zoom: 15
      });

      // 使用地理编码获取区域坐标
      try {
        const result = await geocode(map.value.area);
        if (result && mapInit.value) {
          const point = new BMapGL.Point(result.lng, result.lat);
          mapInit.value.centerAndZoom(point, 15);

          // 延迟调整地图中心
          setTimeout(() => {
            if (mapInit.value) {
              mapInit.value.resize();
              mapInit.value.centerAndZoom(point, 15);
            }
          }, 300);
        }
      } catch (error) {
        console.error('区域地理编码失败:', error);
        // 默认定位到北京
        const point = new BMapGL.Point(116.404, 39.915);
        mapInit.value.centerAndZoom(point, 15);
      }
    } else {
      // 默认定位到北京
      mapInit.value = initBaiduMap("addressContainer", {
        center: { lng: 116.404, lat: 39.915 },
        zoom: 15
      });

      // 延迟调整地图中心
      setTimeout(() => {
        if (mapInit.value) {
          mapInit.value.resize();
          const point = new BMapGL.Point(116.404, 39.915);
          mapInit.value.centerAndZoom(point, 15);
        }
      }, 300);
    }

    // 绑定点击事件（GL 版本）
    // 使用已声明的 BMapGL
    mapInit.value.addEventListener("click", function(e: any) {

      // GL 版本的坐标获取方式：e.latlng
      const lng = e.latlng.lng;
      const lat = e.latlng.lat;

      // 移除旧标注
      if (marker.value) {
        try {
          mapInit.value.removeOverlay(marker.value);
        } catch (err) {
          console.log('移除旧标注失败', err);
        }
      }

      // 创建新标注
      try {
        const point = new BMapGL.Point(lng, lat);
        marker.value = new BMapGL.Marker(point);
        mapInit.value.addOverlay(marker.value);
      } catch (err) {
        console.error('添加标注失败', err);
      }

      // 调用 setMap 更新坐标和地址
      setMap({ lng, lat });
    });

  } catch (error) {
    console.error('初始化百度地图失败:', error);
    throw error; // 抛出错误让上层处理
  }
}

// 地图选择相关函数
function mapChangeHandle(val: any) {
  // val 是选择的地址字符串
  if(val && map.value.suggestions) {
    // 根据地址查找对应的 suggestion
    const iss = map.value.suggestions.filter((item: any) => item.address === val) || [];
    if(iss.length > 0) {
      const is = iss[0];
      map.value.detailAddress = is.address;
      map.value.longitude = is.point.lng;
      map.value.latitude = is.point.lat;
      map.value.coordinate = is.point.lng + ',' + is.point.lat;

      // 更新地图标注位置
      if (mapInit.value) {
        // 使用已声明的 BMapGL
        const point = new BMapGL.Point(is.point.lng, is.point.lat);

        // 移除旧标注
        if (marker.value) {
          mapInit.value.removeOverlay(marker.value);
        }

        // 创建新标注
        marker.value = createMarker(mapInit.value, { lng: is.point.lng, lat: is.point.lat });
        mapInit.value.addOverlay(marker.value);

        // 设置地图中心
        mapInit.value.centerAndZoom(point, 18);
      }
    }
  }
}

function mapQueryHandle(query: string) {
  // 百度地图远程查询逻辑
  if(query && mapInit.value) {
    // 使用工具函数执行搜索
    localSearch(mapInit.value, query)
      .then(results => {
        if (results && results.length > 0) {
          map.value.suggestions = results;
          // 搜索时不自动定位，等用户选择后再定位
        } else {
          map.value.suggestions = [];
        }
      })
      .catch(error => {
        console.error('地点搜索失败:', error);
        map.value.suggestions = [];
      });
  }
}

function mapSubmit(type: string) {
  if (map.value.detailAddress && map.value.longitude && map.value.latitude) {
    dataForm.detailedAddress = map.value.detailAddress;
    dataForm.longitude = String(map.value.longitude);
    dataForm.latitude = String(map.value.latitude);
    ElMessage.success('位置信息已更新');
    drawerClose();
  } else {
    ElMessage.warning('请选择有效的位置信息');
  }
}

// 表单提交
async function dataFormSubmit() {
  // 这里需要从store获取companyId等信息，暂时留空
  dataForm.addOrUpdate = addOrUpdateFlag.value;

  try {
    await dataFormRef.value?.validate();

    submitButton.value = true;
    const { response } = await addOrUpdate(dataForm);
    submitButton.value = false;

    if (response && response.data && (response.data.code as unknown as number) === 0) {
      ElMessage.success(response.data.msg || '操作成功');
      innerVisible.value = false;
    } else {
      ElMessage.error(response?.data?.msg || '操作失败');
    }
  } catch (error) {
    console.error(error);
    submitButton.value = false;
  }
}

// 组件卸载前清理资源
onUnmounted(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});

defineExpose({ init });
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
