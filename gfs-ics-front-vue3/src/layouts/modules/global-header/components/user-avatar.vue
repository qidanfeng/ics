<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';
import { fetchLogOut } from '@/service/api';
import { useAuth } from '@/hooks/business/auth';

defineOptions({ name: 'UserAvatar' });

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();
const { hasAuth } = useAuth();
function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'document_mdm' | 'logout';

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
};

const options = computed(() => {
  const opts: DropdownOption[] = [];
  // 根据权限显示知识库选项
  if (hasAuth('mdm:helpDoc:helpDoc')) {
    opts.push({
      label: $t('common.documentMdm'),
      key: 'document_mdm',
      icon: SvgIconVNode({ icon: 'ph:book', fontSize: 18 })
    });
  }
  opts.push({
    label: $t('common.logout'),
    key: 'logout',
    icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
  });
  return opts;
});

async function logout() {
  window.$messageBox
    ?.confirm($t('common.logoutConfirm'), $t('common.tip'), {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    })
    .then(async () => {
      const { error } = await fetchLogOut();
      if (!error) {
        await authStore.resetStore();
      }
    });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    routerPushByKey(key);
  }
}
</script>

<template>
  <ElButton v-if="!authStore.isLogin" text @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </ElButton>

  <ElDropdown class="px-14px" trigger="click" @command="handleDropdown">
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="{ key, label, icon } in options"
          :key="key"
          class="mx-4px my-1px rounded-6px"
          :icon="icon"
          :command="key"
          v-track="{ name: key === 'document_mdm' ? 'MDM_DOCUMENT' : 'MDM_LOGOUT', description: key === 'document_mdm' ? 'MDM文档' : '退出登录' }"
        >
          {{ label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
    <div class="flex items-center">
      <SvgIcon icon="ph:user-circle" class="mr-5px text-icon-large" />
      <span class="text-16px font-medium">{{ authStore.userInfo.username }}</span>
    </div>
  </ElDropdown>
</template>

<style scoped></style>
