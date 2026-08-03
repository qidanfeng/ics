<template>
  <ElPopover
    placement="bottom-end"
    trigger="click"
    width="320"
    :show-arrow="false"
  >
    <div class="tree-container">
      <!-- 搜索框 -->
      <div class="search-box mb-8px px-8px">
        <ElInput
          v-model="searchValue"
          placeholder="搜索公司"
          clearable
          prefix-icon="Search"
        />
      </div>

      <!-- 树形结构 -->
      <ElTree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :highlight-current="true"
        :expand-on-click-node="false"
        class="tree-wrapper"
        @current-change="handleNodeChange"
      >
        <template #default="{ data }">
          <div class="tree-node-content flex items-center gap-8px">
            <SvgIcon v-if="data.type === 0" icon="mdi:office-building" class="text-16px" />
            <SvgIcon v-if="data.type === 1" icon="mdi:warehouse" class="text-16px" />
            <SvgIcon v-if="data.type === 2" icon="mdi:truck" class="text-16px" />
            <span>{{ data.cnName }}</span>
          </div>
        </template>
      </ElTree>

      <!-- 空状态 -->
      <div v-if="treeData.length === 0" class="empty-state">
        <SvgIcon icon="mdi:search-web" class="empty-icon text-40px" />
        <p class="empty-text text-14px mt-8px">未找到匹配项</p>
      </div>
    </div>
    <template #reference>
      <div
        class="select-trigger flex items-center justify-between cursor-pointer px-12px py-5px border-1px rounded-4px transition-colors"
        :style="{
          width: typeof width === 'number' ? width + 'px' : width
        }"
      >
        <span
          class="select-text text-14px"
          :class="{ 'text-placeholder': !selectedNode, 'text-regular': selectedNode }"
        >
          {{ displayText }}
        </span>
        <SvgIcon icon="mdi:chevron-down" class="select-icon text-16px" />
      </div>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { queryCurrentUserOwnCompany } from '@/service/api/system/company';
import { treeDataTranslate } from '@/utils/common';
import { useCompanyStore } from '@/store/modules/company';
import { useAppStore } from '@/store/modules/app';

defineOptions({ name: 'HeaderSelect' });

// Types
interface TreeNode {
  /** Node id */
  id: string | number;
  /** Node label */
  cnName: string;
  /** Node type: 0-公司, 1-仓库, 2-运输公司 */
  type?: number;
  /** Node code (optional) */
  code?: string;
  /** Children nodes */
  children?: TreeNode[];
}

interface Props {
  /** Placeholder text */
  placeholder?: string;
  /** Select width */
  width?: string | number;
}

type Emits = {
  (e: 'change', data: TreeNode): void;
};

// Props & Emits
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择公司/仓库',
  width: '320px'
});

const emit = defineEmits<Emits>();

// Stores
const appStore = useAppStore();
const companyStore = useCompanyStore();

// Refs
const treeRef = ref();
const searchValue = ref('');
const originalTreeData = ref<TreeNode[]>([]);
const treeData = ref<TreeNode[]>([]);
const selectedNode = ref<TreeNode | null>(null);
const defaultExpandedKeys = ref<(string | number)[]>([]);

// Constants
const treeProps = {
  label: 'cnName',
  children: 'children'
};

// Computed
const displayText = computed(() => {
  return selectedNode.value ? `${selectedNode.value.cnName}` : props.placeholder;
});

// Functions
/**
 * 递归过滤树节点
 */
function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  const result: TreeNode[] = [];
  nodes.forEach(node => {
    // 检查当前节点是否匹配
    const match = node.cnName.toLowerCase().includes(keyword.toLowerCase());
    // 递归过滤子节点
    const filteredChildren = node.children ? filterTree(node.children, keyword) : [];

    // 如果当前节点匹配或有匹配的子节点，则保留该节点
    if (match || filteredChildren.length > 0) {
      result.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      });
    }
  });
  return result;
}

/**
 * 递归收集所有匹配节点的ID（用于展开）
 */
function collectMatchedNodeIds(nodes: TreeNode[], keyword: string): (string | number)[] {
  const ids: (string | number)[] = [];
  function traverse(nodes: TreeNode[]) {
    nodes.forEach(node => {
      if (node.cnName.toLowerCase().includes(keyword.toLowerCase())) {
        ids.push(node.id);
      }
      if (node.children) {
        traverse(node.children);
      }
    });
  }
  traverse(nodes);
  return ids;
}

/**
 * 节点变化处理
 */
function handleNodeChange(data: TreeNode) {
  selectedNode.value = data;
  // 保存选中的公司到 store
  companyStore.setCompany(data);
  //appStore.reloadPage(500);
  emit('change', data);
}

/**
 * 查询当前用户拥有的公司
 */
async function queryCurrentUserOwnCompanyHandle() {
  try {
    const { response } = await queryCurrentUserOwnCompany();
    if (response && response.data && response.data.code === 0 && Array.isArray(response.data.data) && response.data.data.length > 0) {
      const data = response.data.data;
      // 转换为树形结构
      const companyArr = JSON.parse(JSON.stringify(data));
      originalTreeData.value = treeDataTranslate(companyArr, 'id');
      treeData.value = originalTreeData.value;
      // 保存公司列表到 store
      companyStore.setCompanies(data);
      // 默认展开第一级公司
      defaultExpandedKeys.value = [];
      treeData.value.forEach(item => {
        if (item.children && item.children.length > 0) {
          defaultExpandedKeys.value.push(item.id);
        }
      });

      // 默认选中第一个公司或从store恢复
      nextTick(() => {
        if (companyStore.currentCompany) {
          // 如果store中有选中的公司，使用它
          selectedNode.value = companyStore.currentCompany as TreeNode;
          treeRef.value?.setCurrentKey(selectedNode.value.id);
        } else if (data[0]) {
          // 否则选中第一个公司
          selectedNode.value = data[0];
          companyStore.setCompany(data[0]);
          treeRef.value?.setCurrentKey(data[0].id);
        }
      });
    }
  } catch (error) {
    console.error('查询公司数据失败:', error);
  }
}

// Watchers
watch(searchValue, (val) => {
  if (!val || val.trim() === '') {
    // 清空搜索时恢复原始数据
    treeData.value = originalTreeData.value;
    defaultExpandedKeys.value = [];
    // 恢复默认展开第一级
    originalTreeData.value.forEach(item => {
      if (item.children && item.children.length > 0) {
        defaultExpandedKeys.value.push(item.id);
      }
    });
  } else {
    // 执行搜索过滤
    treeData.value = filterTree(originalTreeData.value, val);
    // 展开所有匹配节点
    defaultExpandedKeys.value = collectMatchedNodeIds(originalTreeData.value, val);
  }
});

// Lifecycle
onMounted(() => {
  queryCurrentUserOwnCompanyHandle();
});
</script>



<style scoped>
.tree-container {
  padding: 8px 0;
}

.search-box {
  position: sticky;
  top: 0;
  z-index: 1;
  padding-bottom: 8px;
}

.tree-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.select-trigger {
  min-width: 140px;
  border-color: var(--el-border-color);
}

.select-text {
  &.text-placeholder {
    color: var(--el-text-color-placeholder);
  }
  &.text-regular {
    color: var(--el-text-color-regular);
  }
}

.select-icon {
  color: var(--el-text-color-placeholder);
}

.tree-node-content {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: 120px;
}

.empty-icon {
  color: var(--el-text-color-placeholder);
}

.empty-text {
  color: var(--el-text-color-secondary);
}
</style>
