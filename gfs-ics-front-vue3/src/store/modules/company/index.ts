import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

interface Company {
  id: string | number;
  cnName: string;
  type?: number;
  code?: string;
  children?: Company[];
}

export const useCompanyStore = defineStore(SetupStoreId.Company, () => {
  // 当前选中的公司
  const currentCompany = ref<Company | null>(null);

  // 公司列表
  const companyList = ref<Company[]>([]);

  /** 公司中文名称 */
  const companyCnName = computed(() => {
    return currentCompany.value ? currentCompany.value.cnName : '';
  });

  /** 公司ID */
  const companyId = computed(() => {
    return currentCompany.value ? currentCompany.value.id : null;
  });

  /** 公司类型 */
  const companyType = computed(() => {
    return currentCompany.value ? (currentCompany.value.type ?? 0) : 0;
  });

  /** 公司编码 */
  const companyCode = computed(() => {
    return currentCompany.value ? (currentCompany.value.code ?? '') : '';
  });

  /**
   * 设置当前选中的公司
   */
  function setCompany(company: Company) {
    currentCompany.value = company;
    // 保存到 localStorage
    localStorage.setItem('currentCompany', JSON.stringify(company));
  }

  /**
   * 设置公司列表
   */
  function setCompanies(companies: Company[]) {
    companyList.value = companies;
    // 保存到 localStorage
    localStorage.setItem('companyList', JSON.stringify(companies));
  }

  /**
   * 从 localStorage 恢复选中的公司
   */
  function restoreCompany() {
    const savedCompany = localStorage.getItem('currentCompany');
    if (savedCompany) {
      try {
        currentCompany.value = JSON.parse(savedCompany);
      } catch (error) {
        console.error('恢复公司数据失败:', error);
      }
    }
  }

  /**
   * 恢复公司列表
   */
  function restoreCompanyList() {
    const savedList = localStorage.getItem('companyList');
    if (savedList) {
      try {
        companyList.value = JSON.parse(savedList);
      } catch (error) {
        console.error('恢复公司列表失败:', error);
      }
    }
  }

  /**
   * 清除公司信息
   */
  function clearCompany() {
    currentCompany.value = null;
    companyList.value = [];
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('companyList');
  }

  // 初始化时恢复数据
  restoreCompanyList();
  restoreCompany();

  return {
    currentCompany,
    companyList,
    companyCnName,
    companyId,
    companyType,
    companyCode,
    setCompany,
    setCompanies,
    restoreCompany,
    restoreCompanyList,
    clearCompany
  };
});
