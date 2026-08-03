<template>
  <el-dialog
    title="费用明细"
    width="90%"
    top="20vh"
    :close-on-click-modal="false"
    :visible="visible"
    :append-to-body="true"
    @close="closeHandle"
  >
    <el-table
      :data="tableData"
      border
      size="mini"
      :row-height="30"
      :row-style="{height: '0'}"
      :cell-style="{padding: '0'}"
      style="width: 100%"
      row-key="index"
      height="auto"
    >
      <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
      <el-table-column prop="productNumber" label="产品编码" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="productName" label="产品名称" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lineNumber" label="行号" width="80" align="center"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="100" align="center"></el-table-column>
<!--      <el-table-column prop="inStockQuantity" label="实际入库数量" width="120" align="center"></el-table-column>-->
<!--      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center"></el-table-column>-->
      <el-table-column prop="unitPrice" label="单价" width="100" align="center"></el-table-column>
      <el-table-column prop="costPrice" label="金额" width="130" align="center">
        <template slot-scope="scope">
          <span v-if="!scope.row.editing || scope.row.lineNumber">{{ scope.row.costPrice }}</span>
          <el-input-number v-else v-model="scope.row.costPrice" size="mini" :min="0" :precision="2" :controls="false" style="width: 100%"></el-input-number>
        </template>
      </el-table-column>

      <el-table-column prop="costItemName" align="center" label="费项名称" min-width="150" show-overflow-tooltip></el-table-column>
<!--      <el-table-column prop="amount" align="center" label="费用" width="200"></el-table-column>-->
      <!-- 批次属性列 -->
<!--      <el-table-column type="expand" label="批属性" width="100">-->
<!--        <template slot-scope="{row}">-->
<!--          <div class="batch-attributes-panel">-->
<!--            <div class="attribute-grid">-->
<!--              <div class="attribute-item" v-for="(lotAttribute,index) in row.lotAttributeVos">-->
<!--                <span class="attribute-label">{{lotAttribute.lotAttrLabel}}：</span>-->
<!--                <span class="attribute-value">{{lotAttribute.lotAttrValue  }}</span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <div v-if="!scope.row.lineNumber">
            <el-button v-if="isAuth('ics:returnSupplier:costDetailInfo:edit') && !scope.row.editing" size="mini" type="text" @click="editRow(scope.row)">修改</el-button>
            <el-button v-if="isAuth('ics:returnSupplier:costDetailInfo:edit') && scope.row.editing" size="mini" type="text" @click="saveRow(scope.row)">保存</el-button>
            <el-button v-if="isAuth('ics:returnSupplier:costDetailInfo:delete')" size="mini" type="text" class="delete-btn" @click="deleteRow(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>

</template>
<script>
import API from '@/api'
export default {
  name: "CostDetailInfo",
  data() {
    return {
      visible:false,
      changedData:false,
      tableData:[],
      orderData:{},
      lotAttributeVos:[],
    }
  },
  methods: {
    init(data) {
      // 初始化费用详情数据
      this.tableData = data.detailList;
      this.tableData.forEach((item, idx) => {
        item.index = idx + 1;
      });
      this.visible = true;
      this.changedData = false;
    },
    closeHandle(){
      this.visible = false;
      if(this.changedData){
        this.$emit('refreshData');
      }
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
    editRow(row) {
      row.editing = true;
      this.$forceUpdate();
    },
    saveRow(row) {
      row.editing = false;
      let api = null;
      if(row.id){
        api = API.returnSupplier.billUpdate([row]);
      }else {
        api = API.returnSupplier.billSave([row]);
      }
      api.then(({data})=>{
        if (data.code === 0) {
          this.changedData = true;
          this.$message.success('保存成功');
          this.$forceUpdate();
        }
      }).catch(error=>{

      })

    },
    deleteRow(row) {
      this.$confirm(`确定要删除第[${row.index}]行吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        API.returnSupplier.billDelete([row.id]).then(({data})=>{
          if (data.code === 0) {
            this.changedData = true;
            this.$message.success('删除成功');
            const index = this.tableData.indexOf(row);
            if (index !== -1) {
              this.tableData.splice(index, 1);
              // 重新排序
              this.tableData.forEach((item, idx) => {
                item.index = idx + 1;
              });
            }
          }
        }).catch(error=>{

        })

      });
    },
    tableRowClassName({row, rowIndex}){
      // //把每一行的索引放进row
      // //获取行号最大值,行号和原始行号为当前行号最大值+1
      // if(this.tableData && this.tableData.length > 0) {
      //   this.lineMax = Math.max.apply(Math, this.tableData.map(item => {
      //     return item.lineNum ? parseInt(item.lineNum) : 0
      //   }))
      // }
      // row.lineNum = row.lineNum ? row.lineNum : (this.lineMax+1);
      // row.originalLineNum = row.originalLineNum ? row.originalLineNum : (this.lineMax+1);
      // row.index = rowIndex+1;
    },

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
