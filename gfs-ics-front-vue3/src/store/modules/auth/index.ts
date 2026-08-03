import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { fetchGetUserInfo, fetchLogin } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const isUserInfoInited = ref(false);
  const initUserInfoPromise = ref<Promise<boolean> | null>(null);

  const userInfo: Api.Auth.UserInfo = reactive({
    userId: 0,
    username: '',
    realName: null,
    email: null,
    mobile: null,
    buttons: [

    ]
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE } = import.meta.env;

    return VITE_AUTH_ROUTE_MODE === 'static';
  });

  /** Is login */
  const isLogin = computed(() => Boolean(userInfo.userId));

  /** Reset auth store */
  async function resetStore() {
    recordUserId();

    clearAuthStorage();

    authStore.$reset();


    await handleLogoutRedirect();


    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /** Record the user ID of the previous login session Used to compare with the current user ID on next login */
  function recordUserId() {
    if (!userInfo.userId) {
      return;
    }

    // Store current user ID locally for next login comparison
    localStg.set('lastLoginUserId', userInfo.userId);
  }

  /**
   * Check if current login user is different from previous login user If different, clear all tabs
   *
   * @returns {boolean} Whether to clear all tabs
   */
  function checkTabClear(): boolean {
    if (!userInfo.userId) {
      return false;
    }

    const lastLoginUserId = localStg.get('lastLoginUserId');

    // Clear all tabs if current user is different from previous user
    if (lastLoginUserId !== userInfo.userId) {
      localStg.remove('globalTabs');
      tabStore.clearTabs();

      return true;
    }

    return false;
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param code Verification code
   * @param key Captcha key
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, code?: string, key?: string, redirect = true) {
    startLoading();

    const { data: loginToken, error } = await fetchLogin(userName, password, code, key);

    if (!error) {
      const pass = await loginByToken(loginToken);

      if (pass) {
        // Check if the tab needs to be cleared
        const isClear = checkTabClear();
        let needRedirect = redirect;

        if (isClear) {
          // If the tab needs to be cleared,it means we don't need to redirect.
          needRedirect = false;
        }
        await redirectFromLogin(needRedirect);

        window.$notification?.success({
          title: $t('page.login.common.loginSuccess'),
          message: $t('page.login.common.welcomeBack', { userName: userInfo.username }),
          duration: 4500
        });
      }
    } else {
      resetStore();
    }

    endLoading();
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. get user info (token is automatically set in cookie by OAuth2)
    const pass = await getUserInfo();

    if (pass) {
      token.value = getToken();

      return true;
    }

    return false;
  }

  async function getUserInfo() {
    const { data: info, error } = await fetchGetUserInfo();

    if (!error) {
      // update store
      Object.assign(userInfo, info);

      return true;
    }

    return false;
  }

  async function initUserInfo() {
    if (isUserInfoInited.value) {
      return Boolean(userInfo.userId);
    }

    if (initUserInfoPromise.value) {
      return initUserInfoPromise.value;
    }

    initUserInfoPromise.value = (async () => {
      const pass = await getUserInfo();

      isUserInfoInited.value = true;
      initUserInfoPromise.value = null;

      if (!pass) {
        clearAuthStorage();
      }

      return pass;
    })();

    return initUserInfoPromise.value;
  }

  /**
   * Handle logout redirect based on environment variable
   */
  async function handleLogoutRedirect() {
    const { VITE_GFS_PORTAL_URL } = import.meta.env;

    if (VITE_GFS_PORTAL_URL) {
      // redirect to external portal login
      window.location.href = VITE_GFS_PORTAL_URL;
      return;
    }

    // redirect to internal login route
    await toLogin();
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo
  };
});
