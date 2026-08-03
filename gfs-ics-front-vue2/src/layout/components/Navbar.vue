<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div class="plantForm-container">

          <div class="wrap-scrollbar">
            <el-select @change="clientChangeHandle" style="width: 300px" size="mini"
                       v-model="clientId"
                       filterable placeholder="客户">
              <el-option
                v-for="item in clientList"
                :key="item.id"
                :label="item.cnName"
                :value="item.id">
                <span style="float: left">{{ item.code }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.cnName }}</span>
              </el-option>
            </el-select>
          </div>
        </div>
        <search id="header-search" class="right-menu-item" />
        <help-doc id="help-doc" class="right-menu-item"/>
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <lang-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img v-if="$store.getters.avatar !=null && $store.getters.avatar != '' " :src="$store.getters.avatar" alt=""
               style="width: 16px;margin-right: 5px;vertical-align: middle">
          <i v-else class="el-icon-user-solid" />
          <span class="user-avatar">&nbsp;{{$store.getters.name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" style="text-align: center;">
          <el-dropdown-item divided>
            <span style="display:block;">{{VUE_APP_PUBLISH_VERSION}}</span>
          </el-dropdown-item>
          <el-dropdown-item divided v-loading="logoutButton">
            <span style="display:block;" @click="logout">{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import Search from '@/components/HeaderSearch'
import API from '@/api'
import {treeDataTranslate} from '@/utils'
import store from "../../store";
import HelpDoc from "@/components/HelpDoc";
export default {
  data () {
    return {
      clientId:null,
      currentIndexs:[0],
      clientList:[],
      projectList:[],
      warehouseList:[],
      carrierList:[],
      supplierList:[],
      logoutButton: false,
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    LangSelect,
    Search,
    HelpDoc,
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'headNavs'
    ]),

    VUE_APP_PUBLISH_VERSION(){
      return process.env.VUE_APP_PUBLISH_VERSION
    }
  },
  activated() {

  },
  mounted() {
    this.queryCurrentUserOwnClientHandle();
  },
  methods: {
    treeDataTranslate,
    clickHandle(index,business){
      var i = this.currentIndexs.indexOf(index);
      if(i == -1){
        this.currentIndexs.push(index);
      }else{
        this.currentIndexs.splice(i,1);
      }
      this.$store.dispatch('permission/generateRoutes',business);
    },
    queryCurrentUserOwnClientHandle() {
      API.client.queryActivatedOwnClientInfo().then(({data}) => {
        if (data && data.code === 0) {
          this.clientList = data.data;
          this.$nextTick(() => {
            this.clientId = this.clientList[0].id
            this.$store.dispatch('platForm/setClient',this.clientList[0])
            this.$store.dispatch('platForm/setClients',this.clientList)
            this.loadProjectOptions();
            this.loadWarehouseOptions();
            this.loadCarrierOptions();
            this.loadSupplierOptions();
          })
        } else {
          this.clientList = [];
        }


      }).catch()
    },
    clientChangeHandle(data) {
      for (let i = 0; i < this.clientList.length; i++) {
        let element = this.clientList[i];
        if(element.id == data){
          this.$store.dispatch('platForm/setClient',element)
          this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews, cachedViews}) => {
            this.$router.push('/')
          })
        }
      }
      this.loadProjectOptions();
      this.loadWarehouseOptions();
      this.loadCarrierOptions();
      this.loadSupplierOptions();
    },
    // 获取货主列表
    loadProjectOptions() {
      API.productPriceConfig.getProjectByClientId(this.clientId).then(({data}) => {
        if (data.code === 0) {
          this.projectListst = data.data;
          this.$store.dispatch('platForm/setProjects', this.projectListst)
        }
      });
    },
    // 获取送货仓库列表
    loadWarehouseOptions() {
      API.productPriceConfig.getWarehouseByClientId(this.clientId).then(({data}) => {
        if (data.code === 0) {
          this.warehouseList = data.data;
          this.$store.dispatch('platForm/setWarehouses', this.warehouseList)
        }
      });
    },
    // 获取承运商列表
    loadCarrierOptions() {
      API.carrier.getActivatedCarrierByExternalClientId(this.clientId).then(({data}) => {
        if (data.code === 0) {
          this.carrierList = data.data;
          this.$store.dispatch('platForm/setCarriers', this.carrierList)
        }
      });
    },

    // 获取供应商列表
    loadSupplierOptions() {
      API.productPriceConfig.getSupplierByClientId(this.clientId).then(({data}) => {
        if (data.code === 0) {
          this.supplierList = data.data;
          this.$store.dispatch('platForm/setSuppliers', this.supplierList)
        }
      });
    },

    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      let _this = this;
      let flag = false;
      this.logoutButton = true;
      await API.login.logOut().then(({data})=>{
        this.logoutButton = false;
        if(data && data.code === 0){
          flag = true;
        }else{
          // _this.$message({
          //   type: 'error',
          //   message: '系统退出异常!'
          // });
          this.$message.error('系统退出异常!');
        }
      }).catch(()=>{
        this.logoutButton = false;
      });
      if(flag){
        await this.$store.dispatch('permission/cleanRoutes');
        await this.$store.dispatch('user/logout');
        if(typeof(this.loginUrl) == "undefined"){
          this.$router.push(`/user/login?redirect=${this.$route.fullPath}`);
        }else{
          window.location.href = this.loginUrl;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;
    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &:focus {
      outline: none;
    }
    .plantForm-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }
    .avatar-container {
      margin-right: 10px;
      .avatar-wrapper {
        position: center;
        cursor: pointer;
        .user-avatar {
          font-size: 16px;
        }
        .el-icon-caret-bottom {
          font-size: 12px;
        }
      }
    }
  }
}
  .div1{
    float: left;
    overflow-x: scroll;
    white-space: nowrap;
  }
  .div1::-webkit-scrollbar {
    display: none;
  }
  .card-panel {
    width: auto;
    display: inline-block; /*设为inline-block*/
    margin: 5px;
    font-size: 12px;
    background: #fff;
    .card-panel-icon-wrapper {
      transition: all 0.38s ease-out;
      border-radius: 6px;
      padding: 0 10px;
      text-align: center;
      font-size: 15px;
      line-height: 40px;
    }
    .card-panel-icon-wrapper-click {
      background: #17AD4C;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      padding: 0 10px;
      text-align: center;
      font-size: 15px;
      line-height: 40px;
    }
  }

::-webkit-scrollbar{
  display: none;
}
.wrap-scrollbar {
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.wrap-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
