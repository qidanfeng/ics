import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';
import { queryActivatedOwnClientInfo } from '@/service/api/mdm/client';
import { getProjectByClientId, getWarehouseByClientId, getSupplierByClientId } from '@/service/api/basic/product-price-config';

/**
 * 平台数据 Store（对应 vue2 项目的 platForm store）
 * 用于存储当前选中的客户(client)以及客户关联的 projects/warehouses/suppliers/carriers
 */
export const usePlatformStore = defineStore(SetupStoreId.PageParams + '-platform', () => {
  // 当前选中的客户
  const client = ref<any>(null);
  // 客户列表
  const clients = ref<any[]>([]);
  // 货主列表
  const projects = ref<any[]>([]);
  // 仓库列表
  const warehouses = ref<any[]>([]);
  // 供应商列表
  const suppliers = ref<any[]>([]);
  // 承运商列表
  const carriers = ref<any[]>([]);

  // 是否已初始化
  const inited = ref(false);

  /** 当前客户 ID */
  const clientId = computed(() => (client.value ? client.value.id : null));

  /**
   * 设置当前客户
   */
  function setClient(c: any) {
    client.value = c;
  }

  /**
   * 设置客户列表
   */
  function setClients(list: any[]) {
    clients.value = list || [];
  }

  /**
   * 设置货主列表
   */
  function setProjects(list: any[]) {
    projects.value = list || [];
  }

  /**
   * 设置仓库列表
   */
  function setWarehouses(list: any[]) {
    warehouses.value = list || [];
  }

  /**
   * 设置供应商列表
   */
  function setSuppliers(list: any[]) {
    suppliers.value = list || [];
  }

  /**
   * 设置承运商列表
   */
  function setCarriers(list: any[]) {
    carriers.value = list || [];
  }

  /**
   * 加载货主列表
   */
  async function loadProjects(id: string | number) {
    try {
      const { response } = await getProjectByClientId(id);
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        setProjects(response.data.data || []);
      } else {
        setProjects([]);
      }
    } catch (e) {
      console.error('加载货主列表失败:', e);
      setProjects([]);
    }
  }

  /**
   * 加载仓库列表
   */
  async function loadWarehouses(id: string | number) {
    try {
      const { response } = await getWarehouseByClientId(id);
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        setWarehouses(response.data.data || []);
      } else {
        setWarehouses([]);
      }
    } catch (e) {
      console.error('加载仓库列表失败:', e);
      setWarehouses([]);
    }
  }

  /**
   * 加载供应商列表
   */
  async function loadSuppliers(id: string | number) {
    try {
      const { response } = await getSupplierByClientId(id);
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        setSuppliers(response.data.data || []);
      } else {
        setSuppliers([]);
      }
    } catch (e) {
      console.error('加载供应商列表失败:', e);
      setSuppliers([]);
    }
  }
  /**
   * 切换客户后重新加载关联数据
   */
  async function changeClient(c: any) {
    setClient(c);
    if (!c) {
      setProjects([]);
      setWarehouses([]);
      setSuppliers([]);
      setCarriers([]);
      return;
    }
    await Promise.all([loadProjects(c.id), loadWarehouses(c.id), loadSuppliers(c.id)]);
  }

  /**
   * 初始化平台数据：拉取客户列表，默认选中第一个客户，并加载关联数据
   * 对应 vue2 项目 Navbar 的 queryCurrentUserOwnClientHandle 流程
   */
  async function init() {
    if (inited.value) return;
    try {
      const { response } = await queryActivatedOwnClientInfo();
      if (response && response.data && (response.data.code as unknown as number) === 0) {
        const list = response.data.data || [];
        setClients(list);
        if (list.length > 0) {
          await changeClient(list[0]);
        }
      } else {
        setClients([]);
      }
      inited.value = true;
    } catch (e) {
      console.error('初始化平台数据失败:', e);
    }
  }

  return {
    client,
    clients,
    projects,
    warehouses,
    suppliers,
    carriers,
    clientId,
    inited,
    setClient,
    setClients,
    setProjects,
    setWarehouses,
    setSuppliers,
    setCarriers,
    loadProjects,
    loadWarehouses,
    loadSuppliers,
    changeClient,
    init
  };
});
