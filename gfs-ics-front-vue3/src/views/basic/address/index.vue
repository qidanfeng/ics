<template>
  <div class="h-full">
    <!-- 搜索区域 -->
    <el-card ref="dataFormRef" class="mb-4">
      <el-row :gutter="10" class="search-row">
        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" class="search-col">
          <el-select
            v-model="filters.clientCode"
            filterable
            clearable
            placeholder="客户"
            size="small"
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
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-select
            v-model="filters.customerCode"
            filterable
            clearable
            placeholder="货主"
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in customerList"
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
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-input
            v-model="filters.code"
            placeholder="地址代码"
            clearable
            size="small"
            class="w-full"
          />
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-input
            v-model="filters.name"
            placeholder="地址名称"
            clearable
            size="small"
            class="w-full"
          />
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-cascader
            class="w-full"
            :key="fromOptionKey"
            :options="fromOptions"
            v-model="fromSelectedOptions"
            :props="props"
            :placeholder="!filters.province && !filters.city && !filters.area ? '省市区' :
              ((filters.province ? filters.province : '')  + ' / ' +
              (filters.city ? filters.city : '') + ' / ' +
              (filters.area ? filters.area : ''))"
            ref="fromCascader"
            clearable
            @change="fromHandleChange"
            size="small"
          />
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4">
          <el-select
            v-model="filters.inOut"
            placeholder="地址类型"
            clearable
            filterable
            size="small"
            class="w-full"
          >
            <el-option
              v-for="item in addressTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >

              <div class="flex justify-between items-center w-full">
                <span>{{ item.value }}</span>
                <span class="text-xs text-gray-400">{{ item.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="4" :xl="4" class="search-col">
          <el-select
            v-model="filters.status"
            placeholder="激活状态"
            clearable
            size="small"
            class="w-full"
          >
            <el-option label="激活" :value="true" />
            <el-option label="关闭" :value="false" />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-12 gap-2">
            <!-- 查询 -->
            <div>
              <el-button
                size="small"
                @click="handleSearch"
                type="primary"
                :loading="gridLoading"
                class="w-full truncate"
                v-track="{ name: 'MDM_ADDRESS_SEARCH', description: '地址查询' }"
              >
                查询
              </el-button>
            </div>
            <div>
              <el-button
                size="small"
                v-if="hasAuth('oms:address:add')"
                @click="handleAdd"
                class="w-full truncate"
                v-track="{ name: 'MDM_ADDRESS_ADD', description: '地址新增' }"
              >
                新增
              </el-button>
            </div>
            <div>
              <el-button
                size="small"
                v-if="hasAuth('oms:address:activeOrClose')"
                @click="handleActivate"
                class="w-full truncate"
                v-track="{ name: 'MDM_ADDRESS_ACTIVE_OR_CLOSE', description: '地址激活/关闭' }"
              >
                激活/关闭
              </el-button>
            </div>
            <div>
              <el-dropdown class="w-full">
                <el-button size="small" class="w-full truncate">
                  导入导出<el-icon class="el-icon--right ml-1"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item v-if="hasAuth('oms:address:import')" @click="handleImport" v-track="{ name: 'MDM_ADDRESS_IMPORT', description: '地址导入' }">
                      地址导入
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasAuth('oms:address:export')" @click="handleExport" v-track="{ name: 'MDM_ADDRESS_EXPORT', description: '地址导出' }">
                      地址导出
                    </el-dropdown-item>
                    <el-dropdown-item v-if="hasAuth('oms:address:importForUpdate')" @click="handleUpdateImport" v-track="{ name: 'MDM_ADDRESS_BATCH_UPDATE_IMPORT', description: '地址批量更新-导入' }">
                      批量更新-导入
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 地址列表 -->
    <el-card>
      <el-table
        :data="tableData"
        :border="true"
        stripe
        :height="tableHeight"
        size="small"
        v-loading="gridLoading"
        @selection-change="handleSelectionChange"
        @expand-change="expandChangeHandle"
        @sort-change="sortChangeHandle"
        row-key="id"
        :expand-row-keys="expandRowKeys"
      >
        <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
        <el-table-column prop="clientName" label="客户名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="customerName" label="货主名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="code" label="地址代码" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="地址名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="省-市-区" min-width="150" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.province }} - {{ row.city }} - {{ row.area }}
          </template>
        </el-table-column>
        <el-table-column prop="detailedAddress" label="详细地址" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="linkMan" label="联系人" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="linkManPhone" label="联系人手机" min-width="120" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="linkManTelephone" label="联系人电话" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="linkManEmail" label="联系人邮箱" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="extractsManEmail" label="抄送人邮箱" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="inOut" label="地址类型" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="propertyDictionaryName" label="地址属性" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" min-width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.status" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="pickUpPointFlag" label="提货点" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.pickUpPointFlag === 1">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="transitPointFlag" label="中转点" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.transitPointFlag === 1">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryPointFlag" label="送货点" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.deliveryPointFlag === 1">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bookingFlag" label="装卸货预约" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tag v-if="row.bookingFlag === 1">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="longitude" label="经度" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="latitude" label="维度" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fenceScope" label="电子围栏范围" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="routesCode" label="路线代码" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="routesName" label="路线名称" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="routesSequence" label="路顺" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sowSequence" label="播种顺序" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="extendFirst" label="预留字段1" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="extendSecond" label="预留字段2" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="extendThird" label="预留字段3" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imgUrl" label="地址图片" min-width="80" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <img
              v-if="row.imgUrl"
              :src="row.imgUrl"
              style="min-width: 30px; height: 30px; margin: 0 auto; display: table-cell"
              alt=""
              @click="previewImg(row.imgUrl)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="guidelinesImgUrl" label="地址指引图片" min-width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <img
              v-if="row.guidelinesImgUrl"
              :src="row.guidelinesImgUrl"
              style="min-width: 30px; height: 30px; margin: 0 auto; display: table-cell"
              alt=""
              @click="previewImg(row.guidelinesImgUrl)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lastModifiedBy" label="更新人" min-width="100" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="lastModifiedTime" label="更新时间" min-width="150" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="200" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex items-center justify-center space-x-2">
              <el-button
                type="text"
                size="small"
                v-if="hasAuth('oms:address:update')"
                @click="handleEdit(row)"
                class="truncate"
                v-track="{ name: 'MDM_ADDRESS_EDIT', description: '地址修改' }"
              >
                修改
              </el-button>
              <el-button
                type="danger"
                link
                size="small"
                v-if="hasAuth('oms:address:delete')"
                @click="handleDelete(row.id)"
                class="truncate"
                v-track="{ name: 'MDM_ADDRESS_DELETE', description: '地址删除' }"
              >
                删除
              </el-button>
              <el-dropdown trigger="click" @command="updateDropdownCommand" v-if="hasAuth('oms:address:uploadImg')">
                <el-button
                  type="text"
                  size="small"
                  class="truncate"
                >
                  上传图片<el-icon class="el-icon--right ml-1"><ArrowDown/></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ type: 0, data: row.id }">地址图片</el-dropdown-item>
                    <el-dropdown-item :command="{ type: 1, data: row.id }">地址指引图</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        size="small"
        ref="paginationRef"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        class="mt-2"
      >
      </el-pagination>
    </el-card>

    <!-- 图片预览弹窗 -->
    <el-dialog title="查看图片" top="5vh" v-model="imgDialogVisible" width="60%" center :close-on-click-modal="false">
      <img :src="imgUrl" style="width: 100%; height: 100%;" alt="">
    </el-dialog>

    <!-- 新增/修改弹窗 -->
    <AddOrUpdate
      ref="addOrUpdateRef"
      v-model:visible="addOrUpdateVisible"
      @refresh-data-list="handleRefreshDataList"
    />

    <!-- 上传弹窗 -->
    <Upload
      v-if="uploadVisible"
      ref="uploadRef"
      @refresh-data-list="handleRefreshDataList"
      :template-url="templateUrl"
      :template-name="templateName"
    />

    <!-- 营业时间弹窗 -->
    <BusinessHours
      v-if="businessHoursVisible"
      ref="businessHoursRef"
    />

    <!-- 地址编码器 -->
    <AddressGeocoder
      v-if="addressGeocoderVisible"
      ref="addressGeocoderRef"
    />

    <!-- 下发弹窗 -->
    <DownDialog
      v-if="downDialogVisible"
      @down-handle="downSubmitHandle"
      @verify-unchecked-or-not-handle="verifyUncheckedOrNotHandle"
      ref="downDialogRef"
    />

    <!-- 图片上传弹窗 -->
    <ImgUpload
      v-if="imgUploadVisible"
      ref="imgUploadRef"
      @refresh-data-list="handleRefreshDataList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onUnmounted, computed, defineAsyncComponent } from 'vue';
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import { useAuth } from '@/hooks/business/auth';
import {
  getListPage,
  queryAddressType,
  updateStatusByIds,
  deleteById,
  del,
  exportData,
  addressFile,
  addressFileForUpdate,
  addressDown,
  verifyUncheckedOrNot,
  uploadAddressImg
} from '@/service/api/mdm/address';
import { queryActivatedOwnClientInfo } from '@/service/api/mdm/client';
import { queryActivatedUserOwnProjectInfo } from '@/service/api/mdm/project';
import { queryAddressRelation } from '@/service/api/mdm/address-relation';
import { getProvince, getAreasByParentCode } from '@/service/api/mdm/dt-area-mapping';

// 组件导入
import AddOrUpdate from './modules/add-or-update.vue';
import BusinessHours from './modules/business-hours.vue';
import Upload from '@/components/upload/upload.vue';

// 导入真实组件
import AddressGeocoder from '@/components/address/address-geocoder.vue';
import DownDialog from '@/views/basic/downDialog/downDialog.vue';
import ImgUpload from '@/components/imgUpload/imgUpload.vue';

// 接口定义
interface AddressItem {
  id: string | number;
  code: string;
  name: string;
  clientCode: string;
  clientName: string;
  customerCode: string;
  customerName: string;
  province: string;
  city: string;
  area: string;
  detailedAddress: string;
  linkMan: string;
  linkManPhone: string;
  linkManTelephone: string;
  linkManEmail: string;
  extractsManEmail: string;
  inOut: string;
  propertyDictionaryName: string;
  status: boolean;
  pickUpPointFlag: number;
  transitPointFlag: number;
  deliveryPointFlag: number;
  bookingFlag: number;
  longitude: number | null;
  latitude: number | null;
  fenceScope: number;
  routesCode: string | null;
  routesName: string | null;
  routesSequence: number | null;
  sowSequence: number | null;
  remark: string;
  extendFirst: string;
  extendSecond: string;
  extendThird: string;
  imgUrl: string | null;
  guidelinesImgUrl: string | null;
  createdBy: string | null;
  createdTime: string | null;
  lastModifiedBy: string | null;
  lastModifiedTime: string | null;
  addressRelationList?: any[];
}

interface ClientItem {
  code: string;
  cnName: string;
  id: string | number;
  shortName?: string;  // 添加可能的属性
}

interface CustomerItem {
  code: string;
  shortName: string;
  id: string | number;
}

interface AddressTypeItem {
  value: string;
  name: string;
}

interface CompanyItem {
  id: string | number;
  cnName: string;
  type: string;
}

// 响应式数据
const tableHeight = ref(400);
const dataFormRef = ref();
const paginationRef = ref();
const addOrUpdateRef = ref();
const uploadRef = ref();
const businessHoursRef = ref();
const addressGeocoderRef = ref();
const downDialogRef = ref();
const imgUploadRef = ref();
const fromCascader = ref();

// 权限钩子
const { hasAuth } = useAuth();

// 加载状态
const gridLoading = ref(false);
const exportButton = ref(false);

// 弹窗控制
const addOrUpdateVisible = ref(false);
const uploadVisible = ref(false);
const businessHoursVisible = ref(false);
const addressGeocoderVisible = ref(false);
const downDialogVisible = ref(false);
const imgUploadVisible = ref(false);
const imgDialogVisible = ref(false);

// 图片预览
const imgUrl = ref('');

// 模板配置
const template = [
  { templateName: '地址导入模板', templateUrl: '/oms/template/oms_address.xlsx' },
  { templateName: '地址更新导入模板', templateUrl: '/oms/template/oms_address_batch_update.xlsx' }
];
const templateName = ref('');
const templateUrl = ref('');

// 筛选条件
const filters = reactive({
  clientCode: null as string | null,
  customerCode: null as string | null,
  code: '',
  name: '',
  inOut: null as string | null,
  status: true as boolean | null,
  province: null as string | null,
  city: null as string | null,
  area: null as string | null,
  provinceCode: '',
  cityCode: '',
  areaCode: '',
  dtAreaOmsMnemonicCode: '',
  linkMan: '',
  page: 1,
  limit: 50,
  sidx: '',
  order: '',
  ids: '',
  addressRelationList: [] as any[]
});

// 级联选择器相关
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
      getProvince().then(({ response }: any) => {
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
const clientList = ref<ClientItem[]>([]);
const customerList = ref<CustomerItem[]>([]);
const addressTypes = ref<AddressTypeItem[]>([]);

// 表格数据
const tableData = ref<AddressItem[]>([]);

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 50,
  total: 0
});

// 多选数据
const dataListSelections = ref<AddressItem[]>([]);

// 展开行
const expandRowKeys = ref<string[]>([]);

// 下发ID列表
const downIds = ref<(string|number)[]>([]);

// 公司信息
const companies = ref<CompanyItem[]>([]);

// 获取公司信息
// 注意：这里需要根据实际项目结构从store或其他API获取公司信息
// 由于不知道具体实现，暂时留空，实际使用时需要补充
function getCompaniesInfo() {
  // TODO: 从store或API获取公司信息
  // 示例：
  // const { response } = await getCompanyList(); // 需要实现此API
  // companies.value = response.data || [];
}

// 计算表格高度
function calculateTableHeight() {
  setTimeout(() => {
    const formCard = dataFormRef.value?.$el;
    const paginationContainer = paginationRef.value?.$el;
    const headerHeight = 170;
    const padding = 20;

    if (formCard && paginationContainer) {
      const formCardHeight = formCard.offsetHeight || 0;
      const paginationHeight = paginationContainer.offsetHeight || 0;
      const availableHeight = window.innerHeight - headerHeight - formCardHeight - paginationHeight - padding;

      tableHeight.value = Math.max(availableHeight, 300);
    }
  }, 100);
}

// 加载地址列表
async function loadData() {
  gridLoading.value = true;
  try {
    // 将filters复制到params中，保持原有的数据结构
    const params: any = {
      ...filters,
      page: pagination.currentPage,
      limit: pagination.pageSize,
      sidx: filters.sidx,
      order: filters.order
    };

    const { response } = await getListPage(params);

    if (response && response.data && (response.data.code as unknown as number) === 0) {
      const data = response.data.data;
      tableData.value = data.list || [];
      pagination.total = data.totalCount || 0;
    } else {
      tableData.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error('加载地址列表失败:', error);
    tableData.value = [];
    pagination.total = 0;
  } finally {
    gridLoading.value = false;
  }
}

// 搜索
function handleSearch() {
  pagination.currentPage = 1;
  loadData();
}

// 多选
function handleSelectionChange(val: AddressItem[]) {
  dataListSelections.value = val;
}

// 新增
function handleAdd() {
  addOrUpdateVisible.value = true;
  nextTick(() => {
    addOrUpdateRef.value?.init(null);
  });
}

// 编辑
function handleEdit(row: AddressItem) {
  addOrUpdateVisible.value = true;
  nextTick(() => {
    addOrUpdateRef.value?.init(row.id);
  });
}

// 删除
async function handleDelete(id: string | number) {
  try {
    await ElMessageBox.confirm('确定删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const { response } = await deleteById(id);
    const responseData = response.data;
    const msg = responseData.msg;
    const code = responseData.code;

    if (code === '0' || Number(code) === 0) {
      ElMessage.success('操作成功!');
      loadData();
    } else {
      ElMessage.error(msg || '操作失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败');
    }
  }
}

// 激活/关闭
async function handleActivate() {
  const ids = dataListSelections.value.map(item => item.id);

  if (ids.length === 0) {
    ElMessage.warning('请选择要操作的行');
    return;
  }

  try {
    await ElMessageBox.confirm('确定进行操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const { response } = await updateStatusByIds(ids);

    if (response && response.data && (response.data.code as unknown as number) === 0) {
      ElMessage.success('操作成功');
      loadData();
    } else {
      ElMessage.error(response?.data?.msg || '操作失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('操作失败:', error);
      ElMessage.error('操作失败');
    }
  }
}

// 分页大小变化
function handleSizeChange(val: number) {
  pagination.pageSize = val;
  pagination.currentPage = 1;
  loadData();
}

// 当前页变化
function handleCurrentChange(val: number) {
  pagination.currentPage = val;
  loadData();
}

// 刷新列表
function handleRefreshDataList() {
  loadData();
}

// 获取地址类型
async function getAddressTypes() {
  try {
    const { response } = await queryAddressType();
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      addressTypes.value = response.data.data || [];
    }
  } catch (error) {
    console.error('获取地址类型失败:', error);
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
    console.error('获取客户列表失败:', error);
  }
}

// 获取货主列表
async function getActivatedUserOwnCustomerHandle() {
  try {
    const { response } = await queryActivatedUserOwnProjectInfo();
    if (response && response.data && (response.data.code as unknown as number) === 0) {
      customerList.value = response.data.data || [];
    } else {
      customerList.value = [];
    }
  } catch (error) {
    console.error('获取货主列表失败:', error);
  }
}

// 省市区级联选择器变化
function fromHandleChange(value: any[]) {
  let labels: any[] = [];
  if (value.length) {
    // 获取级联选项的标签
    try {
      labels = (fromCascader.value as any)?.getCheckedNodes()[0]?.pathLabels || [];
    } catch (e) {
      console.warn('无法获取级联标签:', e);
    }
  }
  filters.provinceCode = value[0] ? value[0] : '';
  filters.cityCode = value[1] ? value[1] : '';
  filters.areaCode = value[2] ? value[2] : '';
  filters.province = labels[0] ? labels[0] : null;
  filters.city = labels[1] ? labels[1] : null;
  filters.area = labels[2] ? labels[2] : null;
}

// 排序变化
function sortChangeHandle(column: any) {
  filters.sidx = column.prop;
  filters.order = column.order;
  loadData();
}

// 导入处理
function handleImport() {
  uploadVisible.value = true;
  templateUrl.value = template[0].templateUrl;
  templateName.value = template[0].templateName;
  nextTick(() => {
    const url = addressFile();
    const accept = '.xls,.xlsx';
    uploadRef.value?.init(url, accept);
  });
}

// 更新导入处理
function handleUpdateImport() {
  uploadVisible.value = true;
  templateUrl.value = template[1].templateUrl;
  templateName.value = template[1].templateName;
  nextTick(() => {
    const url = addressFileForUpdate();
    const accept = '.xls,.xlsx';
    uploadRef.value?.init(url, accept);
  });
}

// 导出处理
async function handleExport() {
  const ids = dataListSelections.value.map(item => item.id).join("#");
  filters.ids = ids;
  exportButton.value = true;

  const loading = ElLoading.service({
    lock: true,
    text: '正在处理，请稍后'
  });

  try {
    const { data } = await exportData(filters);
    if (data) {
      // 创建blob对象
      const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      // 创建下载链接
      const downloadElement = document.createElement('a');
      const href = URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = '地址信息.xlsx';
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      URL.revokeObjectURL(href);
      ElMessage.success('导出成功');
    }
  } catch (error) {
    console.error('导出失败:', error);
    ElMessage.error('导出失败');
  } finally {
    exportButton.value = false;
    loading.close();
  }
}

// 图片预览
function previewImg(url: string) {
  imgUrl.value = url;
  imgDialogVisible.value = true;
}

// 更新下拉命令
function updateDropdownCommand(param: { type: number; data: string | number }) {
  imgUploadVisible.value = true;
  nextTick(() => {
    const url = uploadAddressImg() + `?id=${param.data}&type=${param.type}`;
    const accept = '';
    imgUploadRef.value?.init(url, accept);
  });
}

// 展开行变化
async function expandChangeHandle(row: AddressItem, expandedRows: AddressItem[]) {
  if (companies.value && companies.value.length > 0) {
    const expandedRowsIds = expandedRows.map(it => it.id);
    if (expandedRowsIds.includes(row.id)) {
      // 展开行包含当前行，说明是展开状态
      const data = await getAddressRelation(row.id, companies.value.map((it: CompanyItem) => it.id));
      // 给公司赋中文名称
      companies.value.forEach((it: CompanyItem) => {
        data.forEach((item: any) => {
          if (it.id === item.companyId) {
            item.companyName = it.cnName;
            if (item.warehouseCode) {
              item.companyName = item.warehouseCode + item.companyName;
            }
          }
        });
      });
      row.addressRelationList = data;
    }
  }
}

// 下发处理
function downHandle() {
  const ids = dataListSelections.value.map(item => item.id);

  if (ids.length !== 1) {
    ElMessage.warning('请选择一行数据');
    return;
  }

  downIds.value = ids; // 设置downIds用于后续操作

  downDialogVisible.value = true;
  nextTick(() => {
    // 注意：这里需要传入真实的公司列表，目前使用空数组
    downDialogRef.value?.init(companies.value);
  });
}

// 查询地址关联
async function getAddressRelation(addressId: string | number, ownCompanyIds: (string | number)[]): Promise<any[]> {
  try {
    const { response } = await queryAddressRelation(addressId, ownCompanyIds);
    const responseData = response.data;
    const msg = responseData.msg;
    const code = responseData.code;
    if (code === '0' || Number(code) === 0) {
      return responseData.data || [];
    } else {
      ElMessage.error(msg);
      return [];
    }
  } catch (error) {
    console.error('查询地址关联失败:', error);
    return [];
  }
}

// 验证未检查状态
async function verifyUncheckedOrNotHandle(company: CompanyItem, callback: (unchecked: boolean) => void) {
  if (downIds.value.length > 0) {
    try {
      const { response } = await verifyUncheckedOrNot(downIds.value[0], company.id, company.type);
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        callback(response.data.data?.unchecked || false);
      }
    } catch (error) {
      console.error('验证未检查状态失败:', error);
    }
  }
}

// 下发提交处理
async function downSubmitHandle(companyList: CompanyItem[]) {
  const ids = dataListSelections.value.map(item => item.id);
  const obj = {
    ids,
    companyVos: companyList
  };

  try {
    const { response } = await addressDown(obj);
    const { msg, code } = response.data;

    if (code === '0' || Number(code) === 0) {
      ElMessage.success('操作成功!');
      loadData();
    } else {
      ElMessage.error(msg);
    }
  } catch (error) {
    console.error('下发提交失败:', error);
    ElMessage.error('操作失败');
  }
}

// 监听窗口大小变化
const handleResize = () => {
  calculateTableHeight();
};

// 挂载
onMounted(() => {
  nextTick(() => {
    loadData();
    getAddressTypes();
    getActivatedUserOwnClientHandle();
    getActivatedUserOwnCustomerHandle();
    getCompaniesInfo(); // 获取公司信息
    calculateTableHeight();
    window.addEventListener('resize', handleResize);
  });
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.el-dropdown-link {
  color: #42B983;
  font-size: 12px;
  cursor: pointer;
}
.search-col {
  margin-bottom: 10px;
}
</style>
