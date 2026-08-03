<template>
  <ElSelect
    v-model="selectedClientId"
    filterable
    placeholder="客户"
    size="small"
    class="client-select"
    @change="clientChangeHandle"
  >
    <ElOption
      v-for="item in clientList"
      :key="item.id"
      :label="item.cnName"
      :value="item.id"
    >
      <div class="flex justify-between items-center w-full">
        <span>{{ item.code }}</span>
        <span class="text-xs text-gray-400">{{ item.cnName }}</span>
      </div>
    </ElOption>
  </ElSelect>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePlatformStore } from '@/store/modules/platform';
import { useTabStore } from '@/store/modules/tab';

defineOptions({ name: 'HeaderSelect' });

const router = useRouter();
const platformStore = usePlatformStore();
const tabStore = useTabStore();

/** 客户列表 */
const clientList = computed(() => platformStore.clients);

/** 当前选中的客户 ID */
const selectedClientId = computed({
  get: () => platformStore.client?.id ?? null,
  set: () => {}
});

/**
 * 切换客户处理（对应 vue2 Navbar 的 clientChangeHandle）
 * 切换客户后：重新加载关联数据，清空所有 tabs，跳转回首页
 */
async function clientChangeHandle(clientId: string | number) {
  const selected = clientList.value.find((c: any) => c.id === clientId);
  if (!selected) return;
  await platformStore.changeClient(selected);
  tabStore.clearTabs();
  router.push('/');
}
</script>

<style scoped>
.client-select {
  width: 220px;
}
</style>
