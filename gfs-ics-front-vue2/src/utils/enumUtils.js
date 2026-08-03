
// TMS回传作业单状态
export var TmsOrdersStatus=[
  {
    code:'30',
    name:"已排程"
  },{
    code:'40',
    name:"已排车"
  },{
    code:'50',
    name:"待提货"
  },{
    code:'60',
    name:"运输中"
  },{
    code:'70',
    name:"已签收"
  }
]
//WMS入库单回传作业单状态
export var WmsOrdersStatus=[
  {
    code:'0',
    name:"初始化"
  },{
    code:'1',
    name:"已生成波次"
  },{
    code:'2',
    name:"收货中"
  },{
    code:'3',
    name:"收货完成"
  },{
    code:'4',
    name:"上架完成"
  },{
    code:'201',
    name:"EDI取消"
  }
]
//WMS出库单回传作业单状态
export var WmsOutOrdersStatus=[
  {
    code:'0',
    name:"初始化"
  },{
    code:'1',
    name:"已分配"
  },{
    code:'2',
    name:"已下发"
  },{
    code:'3',
    name:"已生成拣货波次"
  },{
    code:'4',
    name:"拣货中"
  },{
    code:'5',
    name:"拣货完成"
  },{
    code:'6',
    name:"打包中"
  },{
    code:'7',
    name:"打包完成"
  },{
    code:'80',
    name:"已交接"
  },{
    code:'90',
    name:"已出库"
  },{
    code:'99',
    name:"取消"
  },{
    code:'120',
    name:"异常"
  },{
    code:'130',
    name:"已拆分"
  },{
    code:'140',
    name:"取消完成"
  },{
    code:'150',
    name:"手动分配中"
  }
]

export var OutOrdersStatus=[
  {
    code:'0',
    name:"初始化"
  },{
    code:'10',
    name:"已下发"
  },

]

export var OUT_ORDER_STATUS_INIT=OutOrdersStatus[0].code;

