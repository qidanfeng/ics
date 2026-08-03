<template>
  <div class="detail-content">
    <el-table
      :data="tableData"
      border
      size="mini"
      :row-height="30"
      :row-style="{height: '0'}"
      :cell-style="{padding: '0'}"
      style="width: 100%"
      height="600px"
      @expand-change="handleInventoryConfirm"
      empty-text="暂无数据"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="productNumber"
        label="产品编号"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="productName"
        label="产品名称"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="lineNumber"
        label="行号"
        width="80"
        align="center"
      />
      <el-table-column
        prop="quantity"
        label="调拨数量"
        width="100"
        align="center"
      />
      <el-table-column
        prop="outStockQuantity"
        label="出库数量"
        width="100"
        align="center"
      />
      <el-table-column
        prop="unitDictionaryName"
        label="单位"
        width="80"
        align="center"
      />
      <el-table-column
        prop="volume"
        label="体积"
        width="80"
        align="center"
      />
      <el-table-column
        prop="weight"
        label="重量"
        width="80"
        align="center"
      />
      <!-- 批次属性列 -->
      <el-table-column type="expand" label="批属性" width="100">
        <template slot-scope="{row}">
          <div class="batch-attributes-panel">
            <div class="attribute-grid">
              <div class="attribute-item" v-for="lotAttribute in row.lotAttributeVos">
                <span class="attribute-label">{{lotAttribute.lotAttrLabel}}：</span>
                <span class="attribute-value">{{lotAttribute.lotAttrValue  }}</span>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import API from "@/api";

export default {
  name: 'TransferOutDetail',
  data() {
    return {
      orderData: {},
      tableData:[],
      lotAttributeVos:[],
      loading: false
    }
  },
  methods: {
    /**
     * 初始化组件数据
     * @param {Object} data - 调拨订单详情数据
     */
    init(data) {
      if (!data) return
      this.orderData = data;
      this.loadOutOmsOrder();
      this.queryLotAttributeByCustomerId();
    },
    // 根据客户ID查询批次属性
    queryLotAttributeByCustomerId() {
      if (!this.orderData.projectId) {
        return;
      }

      API.lotAttribute.queryLotAttributeByCustomerId(this.orderData.projectId, 0).then(({data}) => {
        if (data.code === 0 && data.data) {
          this.lotAttributeVos = data.data;
        }
      }).catch(error => {
        console.error('查询客户批次属性失败:', error);
      });
    },
    handleInventoryConfirm(row) {
      row.lotAttributeVos=[];
      if (this.lotAttributeVos && this.lotAttributeVos.length > 0) {
        this.lotAttributeVos.forEach(config => {
          let lotAttrNumber = config.lotAttrNumber;
          row.lotAttributeVos.push({
            lotAttrLabel:config.lotAttrLabel,
            lotAttrValue:row.lotAttributeEntity[lotAttrNumber]
          })
        })
      }
    },
    loadOutOmsOrder(){
      this.loading = true;
      API.transferOrder.getOutOmsOrderCallbackInfo(this.orderData.id).then(({data})=>{
        if(data.code==0 && data.data){
          this.tableData = data.data;
        }
      }).catch(error=>{
        console.error('获取调拨出库明细失败:', error);
      }).finally(() => {
        this.loading = false;
      })
    }
  }
}
</script>

<style scoped>
.batch-attributes-panel {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;

.attribute-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;

.attribute-item {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  background: white;
  border-radius: 3px;
  border: 1px solid #e8e8e8;

.attribute-label {
  font-weight: 600;
  color: #606266;
  min-width: 80px;
  margin-right: 8px;
}

.attribute-value {
  color: #303133;
  flex: 1;
}
}
}
}
@media (max-width: 1200px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .batch-attributes-panel .attribute-grid {
    grid-template-columns: 1fr;
  }
}
</style>
