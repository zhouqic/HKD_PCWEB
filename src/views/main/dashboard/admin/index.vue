<template>
  <div class="dashboard-admin-container main-content">
    <!-- 筛选 -->
    <el-form>
      <!-- <el-form-item class="inline-block" label-width="15px">
        <el-radio-group v-model="dateType">
          <el-radio label="day">日报</el-radio>
          <el-radio label="month">月报</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item class="inline-block" label="查询日期：" label-width="95px">
        <el-date-picker v-show="dateType === 'day'" v-model="dateRange" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="false"></el-date-picker>
        <el-date-picker v-show="dateType === 'month'" v-model="monthRange" type="monthrange" value-format="yyyy-MM" range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份" :clearable="false"></el-date-picker>
      </el-form-item>
      <el-form-item class="inline-block">
        <el-button type="primary" @click="handleGetCardData()">查询</el-button>
        <el-button type="primary" @click="handleResetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 面板 -->
    <el-row class="panel-group">
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">实收总额
              <tool-tip content="商户实收金额，实收总额 = 充值实收 + 营业实收"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.SS_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">结算总额
              <tool-tip content="实收总额扣除手续费后商家得到的金额"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.JS_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">充值实收
              <tool-tip content="商户会员卡充值实收金额"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.CZ_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">营业实收
              <tool-tip content="商户营业实收金额（不含会员充值），营业实收 = 订单金额 - 退款金额 - 优惠金额 - 余额支付"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.YY_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">订单金额
              <tool-tip content="商户交易订单金额（不含会员充值），订单金额 = 营业实收 + 优惠金额 + 余额支付 + 退款金额"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.DD_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">优惠金额
              <tool-tip content="商户营销活动或优惠券产生的优惠费用"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.YH_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">余额支付
              <tool-tip content="会员卡余额支付的金额（含混合支付的余额支付部分）"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.YE_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">退款金额
              <tool-tip content="商户营业退款金额"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.TK_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数
              <tool-tip content="商户营业订单笔数（不含会员充值）"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :decimals="0" :endVal="panelData.DD_Count"></count>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="card-panel-col">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">单笔均价
              <tool-tip content="平均一笔订单金额，单笔均价 = 订单金额 / 订单数"></tool-tip>
            </div>
            <div class="card-panel-count">
              <count class="card-panel-num" :endVal="panelData.DB_Money"></count>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 图表 -->
    <div class="custom-view">
      <!-- 实收金额趋势图 -->
      <chart-view title="实收金额趋势" :options="SS_CHART_Option"></chart-view>
      <!-- 营业实收来源 -->
      <chart-view title="营业实收来源" :options="SSLY_CHART_Option" class="pull-left"></chart-view>
      <!-- 优惠金额类型 -->
      <chart-view title="优惠金额类型" :options="YHJE_CHART_Option" class="pull-right trans-chart"></chart-view>
      <!-- 新老顾客占比 -->
      <div class="custom-percent-chart">
        <div class="ibox-title"><h5>新老顾客占比</h5></div>
        <div class="chart-container">
          <div class="percent-box" :style="{ width: (panelData.CUSTOM_Data.new_cus_p == 0 && panelData.CUSTOM_Data.old_cus_p != 100  ? 50 : panelData.CUSTOM_Data.new_cus_p) + '%' }"></div>
          <div class="percent-box" :style="{ width: (panelData.CUSTOM_Data.old_cus_p == 0 && panelData.CUSTOM_Data.new_cus_p != 100 ? 50 : panelData.CUSTOM_Data.old_cus_p) + '%' }"></div>
          <div class="percent-box chart-desc">新顾客：{{ panelData.CUSTOM_Data.new_cus_n }}，占比{{ panelData.CUSTOM_Data.new_cus_p }}%</div>
          <div class="percent-box chart-desc">老顾客：{{ panelData.CUSTOM_Data.old_cus_n }}，占比{{ panelData.CUSTOM_Data.old_cus_p }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Count, ToolTip } from './components';
import { getDataByCreaterId, getDataByCreaterIdLine } from '@/api/operation';
import { isValidEndTime } from '@/utils/validate';
import { getNowFormatDate, parseTime } from '@/utils';
import chartView from "../../operations/components/chart";

export default {
  name: 'dashboard-admin',
  components: {
    Count,
    ToolTip,
    chartView
  },
  data() {
    return {
      dateRange: [getNowFormatDate(), getNowFormatDate()],
      monthRange: [parseTime(new Date(), '{y}-{m}'), parseTime(new Date(), '{y}-{m}')],
      dateType: 'day',
      panelData: {
        SS_Money: 0, // 实收总额
        JS_Money: 0, // 结算总额
        CZ_Money: 0, // 充值实收
        YY_Money: 0, // 营业实收
        DD_Money: 0, // 订单金额
        YH_Money: 0, // 优惠金额
        YE_Money: 0, // 余额支付
        TK_Money: 0, // 退款金额
        DD_Count: 0, // 订单数
        DB_Money: 0,  // 单笔均价
        SS_CHART_Data: { // 实收趋势图数据
          X_Data: [],   // 时间
          SSJE_Data: [],// 实收金额
          YYSS_Data: [],// 营业实收
          CZSS_Data: [],// 充值实收
        },
        SSLY_CHART_Data: {
          FFCK_Data: 0, // 付费次卡
          SMZF_Data: 0, // 扫码支付
          HYLB_Data: 0, // 会员礼包支付
          HYKK_Data: 0,  // 会员开卡
          MDDD_Data: 0, // 门店
          SCDD_Data: 0 // 商城
        },
        YHJE_CHART_Data: {
          JFDK_Data: 0, // 积分抵扣
          FXHB_Data: 0, // 分享红包
          YHQ_Data: 0,  // 优惠券
          MJYH_Data: 0  // 满减优惠
        },
        CUSTOM_Data: { // 新老顾客占比数据
          old_cus_p: 0, // 比例
          old_cus_n: 0, // 数量
          new_cus_p: 0,
          new_cus_n: 0
        }
      },
      // 实收金额趋势图
      SS_CHART_Option: {
        color: ['#0000ff', '#f59a23', '#ec808d'],
        tooltip: {
          trigger: 'axis',
          formatter: "{b}<br/>{a0}: {c0}<br/>{a1}: {c1}<br/>{a2}: {c2}",
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          bottom: 25,
          left: 50,
          right: 50
        },
        legend: {
          data: ['实收金额', '营业实收', '充值实收'],
          top: 20
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [{ show: true, type: 'value' }],
        series: [
          {
            name: '实收金额',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '营业实收',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '充值实收',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      },
      // 营业实收来源
      SSLY_CHART_Option: {
        color: ['#4ecb73', '#36cbcb', '#3aa1ff', '#fbd437', '#4b5269', '#ff5f87'],
        legend: {
          x: 'center',
          top: 20,
          data:['付费次卡','扫码支付','会员礼包支付','会员开卡','门店','商城']
        },
        series : [
          {
            name:'总览',
            type:'pie',
            radius : "60%",
            center : ['50%', '65%'],
            label : {
              normal : {
                formatter: '{b}: {c}, {d}%',
                textStyle : {
                  color: '#000',
                  fontSize : 13
                }
              }
            },
            data:[
              { value: 0, name: '付费次卡'},
              { value: 0, name: '扫码支付'},
              { value: 0, name: '会员礼包支付'},
              { value: 0, name: '会员开卡'},
              { value: 0, name: '门店'},
              { value: 0, name: '商城'}
            ]
          }
        ]
      },
      // 优惠金额类型
      YHJE_CHART_Option: {
        color: ['#4ecb73', '#36cbcb', '#3aa1ff', '#fbd437'],
        legend: {
          x: 'center',
          top: 20,
          data:['积分抵扣','分享红包','优惠券','满减优惠']
        },
        series : [
          {
            name:'总览',
            type:'pie',
            radius : "60%",
            center : ['50%', '65%'],
            label : {
              normal : {
                formatter: '{b}: {c}, {d}%',
                textStyle : {
                  color: '#000',
                  fontSize : 13
                }
              }
            },
            data:[
              { value: 0, name: '积分抵扣'},
              { value: 0, name: '分享红包'},
              { value: 0, name: '优惠券'},
              { value: 0, name: '满减优惠'}
            ]
          }
        ]
      }
    }
  },
  created() {
    this.handleGetCardData();
  },
  methods: {
    handleResetForm() {
      this.dateRange = [getNowFormatDate(), getNowFormatDate()];
    },
    handleGetCardData() {
      let data = {
        dateFormat: this.dateType === 'day' ? this.dateRange[0] : this.monthRange[0],
        endTime: this.dateType === 'day' ? this.dateRange[1] : this.monthRange[1],
        type: this.dateType
      };
      let dateBegin = new Date(data.dateFormat).getTime();
      let dateEnd = new Date(data.endTime).getTime();
      let dateDiff = dateEnd - dateBegin;
      // 计算出相差天数,大于 30 天无法
      if (data.type === 'day' && Math.floor((dateDiff / (24 * 3600 * 1000)) > 31)) {
        this.$message.error("当前最多可查询一个月的营业数据，请重新选择日期");
        return false;
      }
      getDataByCreaterId(data).then(res => {
        /* panel数据 */
        let shopHomeData = res.tableData.shopHomeVo;
        // 实收总额
        this.panelData.SS_Money = parseFloat((parseFloat(shopHomeData.businessNum) + parseFloat(shopHomeData.rechargeNum)).toFixed(2));
        // 结算总额
        this.panelData.JS_Money = parseFloat(shopHomeData.balanceMoney);
        // 充值实收
        this.panelData.CZ_Money = parseFloat(shopHomeData.rechargeNum);
        // 营业实收
        this.panelData.YY_Money = parseFloat(shopHomeData.businessNum);
        // 订单金额
        this.panelData.DD_Money = parseFloat(shopHomeData.transactionNum);
        // 优惠金额
        this.panelData.YH_Money = parseFloat(shopHomeData.discountNum);
        // 余额支付
        this.panelData.YE_Money = parseFloat(shopHomeData.balanceNum);
        // 退款金额
        this.panelData.TK_Money = parseFloat(shopHomeData.refundNum);
        // 订单数
        this.panelData.DD_Count = parseFloat(shopHomeData.transactionCount);
        // 单笔均价
        this.panelData.DB_Money = parseFloat(shopHomeData.onePrice);
        /* 营业实收来源 */
        // 付费次卡
        this.panelData.SSLY_CHART_Data.FFCK_Data = parseFloat(res.tableData.getMultiSubcardAnalysis[0].sumSettleAccount);
        // 扫码支付
        this.panelData.SSLY_CHART_Data.SMZF_Data = parseFloat(shopHomeData.orderMoney);
        // 门店
        this.panelData.SSLY_CHART_Data.MDDD_Data = parseFloat(shopHomeData.storeMoney);
        // 商城
        this.panelData.SSLY_CHART_Data.SCDD_Data = parseFloat(shopHomeData.mallMoney);
        // 会员礼包支付
        this.panelData.SSLY_CHART_Data.HYLB_Data = parseFloat(res.tableData.getMemberVIP[0].sumSettleAccount);
        // 会员开卡
        this.panelData.SSLY_CHART_Data.HYKK_Data = parseFloat(res.tableData.orderDetailCard[0].sumSettleAccount);
        // 初始化chart
        this.SSLY_CHART_Option.series[0].data[0].value = this.panelData.SSLY_CHART_Data.FFCK_Data;
        this.SSLY_CHART_Option.series[0].data[1].value = this.panelData.SSLY_CHART_Data.SMZF_Data;
        this.SSLY_CHART_Option.series[0].data[2].value = this.panelData.SSLY_CHART_Data.HYLB_Data;
        this.SSLY_CHART_Option.series[0].data[3].value = this.panelData.SSLY_CHART_Data.HYKK_Data;
        this.SSLY_CHART_Option.series[0].data[4].value = this.panelData.SSLY_CHART_Data.MDDD_Data;
        this.SSLY_CHART_Option.series[0].data[5].value = this.panelData.SSLY_CHART_Data.SCDD_Data;

        /* 优惠金额类型 */
        // 积分抵扣
        this.panelData.YHJE_CHART_Data.JFDK_Data = parseFloat(res.tableData.business.integralMoney);
        // 分享红包
        this.panelData.YHJE_CHART_Data.FXHB_Data = parseFloat(res.tableData.business.shareMoney);
        // 优惠券
        this.panelData.YHJE_CHART_Data.YHQ_Data = parseFloat(res.tableData.business.coupon);
        // 满减优惠
        this.panelData.YHJE_CHART_Data.MJYH_Data = parseFloat(res.tableData.business.fullReduction);
        // 初始化chart
        this.YHJE_CHART_Option.series[0].data[0].value = this.panelData.YHJE_CHART_Data.JFDK_Data;
        this.YHJE_CHART_Option.series[0].data[1].value = this.panelData.YHJE_CHART_Data.FXHB_Data;
        this.YHJE_CHART_Option.series[0].data[2].value = this.panelData.YHJE_CHART_Data.YHQ_Data;
        this.YHJE_CHART_Option.series[0].data[3].value = this.panelData.YHJE_CHART_Data.MJYH_Data;

        /* 新老顾客占比 */
        // 新顾客
        this.panelData.CUSTOM_Data.new_cus_n = res.tableData.newAndOldVO.newCus;
        this.panelData.CUSTOM_Data.new_cus_p = Math.round(res.tableData.newAndOldVO.newCusPercent * 100);
        // 优惠券
        this.panelData.CUSTOM_Data.old_cus_n = res.tableData.newAndOldVO.oldCus;
        this.panelData.CUSTOM_Data.old_cus_p = Math.round(res.tableData.newAndOldVO.oldCusPercent * 100);

        this.$forceUpdate();
      })
      /* 趋势图 */
      getDataByCreaterIdLine(data).then(res => {
        this.panelData.SS_CHART_Data.X_Data = [];
        this.panelData.SS_CHART_Data.SSJE_Data = [];
        this.panelData.SS_CHART_Data.YYSS_Data = [];
        this.panelData.SS_CHART_Data.CZSS_Data = [];
        res.tableData.forEach(item => {
          this.panelData.SS_CHART_Data.X_Data.push(item.time);
          this.panelData.SS_CHART_Data.SSJE_Data.push(item.total);
          this.panelData.SS_CHART_Data.YYSS_Data.push(item.businessNum);
          this.panelData.SS_CHART_Data.CZSS_Data.push(item.rechargeNum);
        })
        // 初始化chart
        this.SS_CHART_Option.xAxis[0].data = this.panelData.SS_CHART_Data.X_Data;
        this.SS_CHART_Option.series[0].data = this.panelData.SS_CHART_Data.SSJE_Data;
        this.SS_CHART_Option.series[1].data = this.panelData.SS_CHART_Data.YYSS_Data;
        this.SS_CHART_Option.series[2].data = this.panelData.SS_CHART_Data.CZSS_Data;

        this.$forceUpdate();
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.custom-view {
  margin: 20px;
  overflow:hidden;
  .chart-views {
    background:#fff;
    margin-bottom: 15px;
    min-width: 400px;
  }
  .chart-views:nth-child(1) {
    width: 100%;
  }
  .custom-percent-chart {
    width: 100%;
    float: left;
    .ibox-title{
      border-bottom: 1px solid #e7eaec;
      background-color: #fff;
      margin-bottom: 0;
      padding: 14px 15px 7px;
      min-height: 48px;
      h5 {
        display: inline-block;
        font-size: 14px;
        margin: 0 0 7px;
        padding: 0;
        text-overflow: ellipsis;
        float: left;
      }
    }
    .chart-container {
      padding-top: 20px;
      overflow: hidden;
    }
    .percent-box {
      width: 50%;
      height: 60px;
      float: left;
    }
    .percent-box:nth-child(1) {
      background-color: #f59a23;
      margin-right: 0;
    }
    .percent-box:nth-child(2) {
      background-color: #02a7f0;
    }
    .percent-box:nth-child(3), .percent-box:nth-child(4) {
      line-height: 60px;
      text-align: center;
    }
  }
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin: 10px 15px; 
    width: calc((100% - 150px) / 5);
  }
  .card-panel {
    font-size: 12px;
    padding: 15px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border: 1px solid rgba(187, 187, 187, 1);
    .icon-help {
      font-size: 18px;
    }
    .card-panel-description {
      font-weight: bold;
      margin-bottom: 15px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-bottom: 15px;
      }
      .card-panel-count {
        margin-bottom: 10px;
        text-align: center;
      }
      .card-panel-num {
        font-size: 24px;
        color: #EE454C;
      }
    }
  }
}
</style>