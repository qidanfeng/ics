<template>
  <el-dialog
    title="月结账单详情"
    :visible.sync="dialogVisible"
    width="90%"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="recordData" class="detail-header">
      <el-descriptions :column="4" border size="small">
        <el-descriptions-item label="账单号">{{ recordData.billNumber }}</el-descriptions-item>
        <el-descriptions-item label="账单月份">{{ recordData.billMonth }}</el-descriptions-item>
        <el-descriptions-item label="供应商">{{ recordData.supplierName }}</el-descriptions-item>
<!--        <el-descriptions-item label="货主">{{ recordData.projectName }}</el-descriptions-item>-->
<!--        <el-descriptions-item label="仓库">{{ recordData.warehouseName }}</el-descriptions-item>-->
        <el-descriptions-item label="订单个数">{{ recordData.orderCount }}</el-descriptions-item>
        <el-descriptions-item label="应收总金额">{{ recordData.arTotalAmount.toFixed(2) }} 元</el-descriptions-item>
        <el-descriptions-item label="应付总金额">{{ recordData.apTotalAmount.toFixed(2) }} 元</el-descriptions-item>
<!--        <el-descriptions-item label="税额">{{ recordData.taxAmount.toFixed(2) }} 元</el-descriptions-item>-->
      </el-descriptions>
    </div>

    <el-table
      :data="tableData"
      border
      size="mini"
      style="width: 100%; margin-top: 15px"
      max-height="500"
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column prop="showOrderNumber" label="订单号" width="160" align="center" show-overflow-tooltip />
<!--      <el-table-column prop="orderNumber" label="订单号" width="160" align="center" show-overflow-tooltip />-->
      <el-table-column prop="documentTypeName" label="单据类型" width="100" align="center" />
      <el-table-column prop="costTypeName" label="费用类型" width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="costItemName" label="费项" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="inStockDate" label="入库日期" width="120" align="center" />
      <el-table-column prop="outStockDate" label="出库日期" width="120" align="center" />
      <el-table-column prop="supplierName" label="供应商" min-width="250" align="center" show-overflow-tooltip />
      <el-table-column prop="warehouseName" label="仓库" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="projectName" label="货主" min-width="120" align="center" show-overflow-tooltip />
      <el-table-column prop="lineNumber" label="行号" width="80" align="center"></el-table-column>
      <el-table-column prop="productNumber" label="产品编码" width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="productName" label="产品名称" min-width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="temperatureRangeName" label="温区" width="80" align="center" />
      <el-table-column prop="quantity" label="订单数量" width="100" align="center" />
      <el-table-column prop="inStockQuantity" label="实际入库数量" width="100" align="center" />
      <el-table-column prop="outStockQuantity" label="实际出库数量" width="100" align="center" />
      <el-table-column prop="unitDictionaryName" label="单位" width="80" align="center" />
      <el-table-column prop="quantityDifference" label="货差" width="80" align="center" />
      <el-table-column prop="unitPrice" label="单价" width="100" align="right">
<!--        <template slot-scope="scope">-->
<!--          {{ scope.row.unitPrice ? scope.row.unitPrice.toFixed(2) : '' }}-->
<!--        </template>-->
      </el-table-column>
      <el-table-column prop="amount" label="总金额" width="120" align="right">
        <template slot-scope="scope">
          <span style="color: #E6A23C; font-weight: bold">{{ scope.row.amount ? scope.row.amount.toFixed(2) : '0.00' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createdBy" label="创建人" width="100" align="center" show-overflow-tooltip/>
      <el-table-column prop="createdTime" label="创建时间" width="160" align="center" />
      <el-table-column prop="lastModifiedBy" label="修改人" width="100" align="center" show-overflow-tooltip/>
      <el-table-column prop="lastModifiedTime" label="修改时间" width="160" align="center" />
    </el-table>

<!--    <div slot="footer">-->
<!--      <el-button @click="handleClose">关闭</el-button>-->
<!--      <el-button type="primary" @click="handleExport">导出明细</el-button>-->
<!--    </div>-->
  </el-dialog>
</template>

<script>
import API from "@/api";
export default {
  name: 'OrderFeeDetailDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    billData: {
      type: Object,
      default: null
    },
    orderDetailData: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '账单详情 - 订单费用明细'
    }
  },
  data() {
    return {
      recordData:null,
      dialogVisible:false,
      tableData:[],
      // 模拟测试数据
      mockBillData: {
        billNumber: 'BL202603060001',
        billMonth: '2026-03',
        supplierName: '上海鲜达供应链有限公司',
        projectName: '华润万家超市',
        warehouseName: '上海浦东冷链仓库',
        orderCount: 5,
        totalAmount: 15890.50,
        taxAmount: 2065.77,
        billType: 'MONTHLY'
      },
      mockOrderDetailData: [
        {
          orderNo: 'PO202603060001',
          orderType: '入库单',
          costItemName: '仓储费',
          inboundDate: '2026-03-01',
          purchaseOrderNo: 'CG20260301001',
          supplierName: '上海鲜达供应链有限公司',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '华润万家超市',
          lineNumber: 1,
          productNumber: 'SP001-A001',
          productName: '有机纯牛奶250ml',
          tempZone: '冷藏',
          orderQuantity: 500,
          receivedQuantity: 498,
          unit: '箱',
          difference: 2,
          unitPrice: 12.50,
          totalAmount: 6225.00,
          createdBy: '张三',
          createdTime: '2026-03-01 10:30:00',
          lastModifiedBy: '李四',
          lastModifiedTime: '2026-03-01 14:20:00'
        },
        {
          orderNo: 'PO202603060001',
          orderType: '入库单',
          costItemName: '自提运费',
          inboundDate: '2026-03-01',
          purchaseOrderNo: 'CG20260301001',
          supplierName: '上海鲜达供应链有限公司',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '华润万家超市',
          totalAmount: 20.00,
          createdBy: '张三',
          createdTime: '2026-03-01 10:30:00',
          lastModifiedBy: '李四',
          lastModifiedTime: '2026-03-01 14:20:00'
        },
        {
          orderNo: 'PO202603060002',
          orderType: '入库单',
          costItemName: '装卸费',
          inboundDate: '2026-03-02',
          purchaseOrderNo: 'CG20260302001',
          supplierName: '北京冷链物流集团',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '盒马鲜生',
          lineNumber: 1,
          productNumber: 'SP002-B002',
          productName: '进口车厘子500g',
          tempZone: '冷冻',
          orderQuantity: 200,
          receivedQuantity: 200,
          unit: '盒',
          difference: 0,
          unitPrice: 8.00,
          totalAmount: 1600.00,
          createdBy: '王五',
          createdTime: '2026-03-02 09:15:00',
          lastModifiedBy: '',
          lastModifiedTime: ''
        },
        {
          orderNo: 'PO202603060003',
          orderType: '入库单',
          costItemName: '分拣费',
          inboundDate: '2026-03-03',
          purchaseOrderNo: 'CG20260303001',
          supplierName: '广州优鲜配送中心',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '永辉超市',
          lineNumber: 1,
          productNumber: 'SP003-C003',
          productName: '新鲜三文鱼切片200g',
          tempZone: '冷藏',
          orderQuantity: 300,
          receivedQuantity: 295,
          unit: '份',
          difference: 5,
          unitPrice: 15.00,
          totalAmount: 4425.00,
          createdBy: '赵六',
          createdTime: '2026-03-03 11:45:00',
          lastModifiedBy: '张三',
          lastModifiedTime: '2026-03-03 16:30:00'
        },
        {
          orderNo: 'PO202603060004',
          orderType: '入库单',
          costItemName: '仓储费',
          inboundDate: '2026-03-04',
          purchaseOrderNo: 'CG20260304001',
          supplierName: '深圳速达冷链',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '叮咚买菜',
          lineNumber: 1,
          productNumber: 'SP004-D004',
          productName: '澳洲牛排套餐',
          tempZone: '冷冻',
          orderQuantity: 150,
          receivedQuantity: 148,
          unit: '套',
          difference: 2,
          unitPrice: 22.80,
          totalAmount: 3374.40,
          createdBy: '李四',
          createdTime: '2026-03-04 08:20:00',
          lastModifiedBy: '王五',
          lastModifiedTime: '2026-03-04 13:45:00'
        },
        {
          orderNo: 'PO202603060005',
          orderType: '入库单',
          costItemName: '配送费',
          inboundDate: '2026-03-05',
          purchaseOrderNo: 'CG20260305001',
          supplierName: '上海鲜达供应链有限公司',
          warehouseName: '上海浦东冷链仓库',
          ownerName: '华润万家超市',
          lineNumber: 1,
          productNumber: 'SP005-E005',
          productName: '有机蔬菜礼盒',
          tempZone: '常温',
          orderQuantity: 100,
          receivedQuantity: 98,
          unit: '箱',
          difference: 2,
          unitPrice: 2.66,
          totalAmount: 266.10,
          createdBy: '张三',
          createdTime: '2026-03-05 15:00:00',
          lastModifiedBy: '',
          lastModifiedTime: ''
        }
      ]
    }
  },
  methods: {
    async init(recordData) {
      this.dialogVisible = true;
      this.recordData = recordData;
      // 调用API加载订单明细数据
      if (recordData && recordData.billNumber) {
        await this.loadRecordDetailData(recordData.billNumber);
      } else {
        this.$message.warning('账单数据不完整，无法获取明细');
        this.tableData = [];
      }
    },

    /**
     * 加载账单明细数据
     */
    async loadRecordDetailData(billNumber) {
      try {
        // 调用API获取账单明细数据
        const { data } = await API.billMonthRecord.getDetailListByBillNumber(billNumber);

        if (data.code === 0 && data.data) {
          // 处理返回的数据，添加序号
          // this.tableData = this.formatTableData(data.data);
          this.tableData = data.data;
          this.$message.success('账单明细数据加载成功');
        } else {
          this.$message.error(data.msg || '获取账单明细失败');
          this.tableData = [];
        }
      } catch (error) {
        console.error('获取账单明细失败:', error);
        this.$message.error('获取账单明细失败，请重试');
        this.tableData = [];
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    handleExport() {
      this.$emit('export')
    }
  }
}
</script>

<style scoped>
.detail-header {
  margin-bottom: 15px;
}
</style>
