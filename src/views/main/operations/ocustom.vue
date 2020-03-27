<template>
  <div class="custom-view">
    <!-- 用户数量统计 -->
    <chart-view title="用户数量统计" :options="numOptions" :showTools="true" @change="handleSetNumChart" class="pull-left"></chart-view>
    <!-- 转化率统计 -->
    <chart-view title="转化率统计" :options="transOptions" :showTools="true" @change="handleSetTransChart" class="pull-right trans-chart"></chart-view>
    <!-- 顾客生命周期 -->
    <chart-view title="顾客生命周期" :options="lifeCycleOptions" class="pull-left"></chart-view>
    <!-- 潜在顾客 -->
    <chart-view title="潜在顾客" :options="latentOptions" class="pull-right latent-chart"></chart-view>
    <!-- 活跃顾客 -->
    <chart-view title="活跃顾客" :options="activeOptions" class="pull-left"></chart-view>
    <!-- 流失顾客 -->
    <chart-view title="流失顾客" :options="lostOptions" class="pull-right lost-chart"></chart-view>
  </div>
</template>
<script>
import chartView from "./components/chart";
import { pcFindPresentation, findCusStatistics, findCusPresentation } from "@/api/operation";
import _ from 'lodash';
export default {
  name: "ocustom_views",
  components: { chartView },
  data() {
    return {
      // 用户数量统计
      numOptions: {
        color: ['#ff5f87', '#ffbb4c', '#86d23a'],
        tooltip: {
          trigger: 'axis',
          formatter: "{b} <br/>{a0} : {c0} 人<br/>{a1} : {c1} 人<br/>{a2} : {c2} 人",
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['总用户数量', '老客数量', '新客数量'],
          top: 20
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [{ show: false, type: 'value' }],
        series: [
          {
            name: '总用户数量',
            type: 'bar',
            barGap: 0,
            barWidth: 10,
            data: []
          },
          {
            name: '老客数量',
            type: 'bar',
            barWidth: 10,
            data: []
          },
          {
            name: '新客数量',
            type: 'bar',
            barWidth: 10,
            data: []
          }
        ]
      },
      // 转化率统计
      transOptions: {
        title: {
          x: 'center',
          bottom: 10,
          subtext: "转化率=新增粉丝与新增消费人数之比     复购率=新增粉丝与新增会员（在本店开卡）之比"
        },
        color: ['#ff5f87', '#ffbb4c'],
        tooltip: {
          trigger: 'axis',
          formatter: "{b} <br/>{a0} : {c0} %<br/>{a1} : {c1} %",
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['转化率', '复购率'],
          top: 20
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: []
          }
        ],
        yAxis: [{ show: false, type: 'value' }],
        series: [
          {
            name: '转化率',
            type: 'line',
            smooth: true,
            data: []
          },
          {
            name: '复购率',
            type: 'line',
            smooth: true,
            data: []
          }
        ]
      },
      // 顾客生命周期
      lifeCycleOptions: {
        color: ['#ff5f87', '#ffbb4c', '#4b5269'],
        tooltip : {
          trigger: 'item',
          formatter: data =>  data.seriesName + "<br/>"+ data.name+ " : " + data.value + "人 (" + data.data.rate + "%)"
        },
        legend: {
          x: 'center',
          top: 20,
          data:['潜客','活跃客','流失客']
        },
        series : [
          {
            name:'总览',
            type:'pie',
            radius : "50%",
            center : ['50%', '55%'],
            data:[
              { value: 0, name: '潜客'},
              { value: 0, name: '活跃客'},
              { value: 0, name: '流失客'}
            ]
          }
        ]
      },
      // 潜在顾客
      latentOptions: {
        color: ['#ff5f87', '#ffbb4c'],
        tooltip : {
          trigger: 'item',
          formatter: data =>  data.seriesName + "<br/>"+ data.name+ " : " + data.value + "人 (" + data.data.rate + "%)"
        },
        legend: {
          x: 'center',
          top: 20,
          data:['店铺粉丝','浏览店铺多次未消费']
        },
        series : [
          {
            name: '总览',
            type: 'pie',
            radius : '50%',
            center: ['50%', '55%'],
            data:[
              { value: 0, name: '店铺粉丝'},
              { value: 0, name: '浏览店铺多次未消费'}
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 活跃顾客
      activeOptions: {
        color: ['#ff5f87', '#ffbb4c', '#86d23a'],
        tooltip : {
          trigger: 'item',
          formatter: data =>  data.seriesName + "<br/>"+ data.name+ " : " + data.value + "人 (" + data.data.rate + "%)"
        },
        legend: {
          x: 'center',
          top: 20,
          data:['活跃新客', '活跃常客', '活跃忠诚客']
        },
        series : [
          {
            name: '总览',
            type: 'pie',
            radius : '50%',
            center: ['50%', '55%'],
            data:[
              { value: 0, name: '活跃新客' },
              { value: 0, name: '活跃常客' },
              { value: 0, name: '活跃忠诚客' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 流失顾客
      lostOptions: {
        color: ['#ff5f87', '#ffbb4c'],
        tooltip : {
          trigger: 'item',
          formatter: data =>  data.seriesName + "<br/>"+ data.name+ " : " + data.value + "人 (" + data.data.rate + "%)"
        },
        legend: {
          x: 'center',
          top: 20,
          data:['沉默顾客','流失顾客']
        },
        series : [
          {
            name: '总览 ',
            type: 'pie',
            radius : '50%',
            center: ['50%', '55%'],
            data:[
              { value: 0, name: '沉默顾客', rate: 0 },
              { value: 0, name: '流失顾客', rate: 0 }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  },
  created() {
    this.handleGetPieChartData();
    this.handleSetNumChart("day");
    this.handleSetTransChart("day");
  },
  methods: {
    handleSetNumChart(params) {
      let data;
      if (typeof params == "string") {
        data = {
          type: params
        }
      } else {
        data = {
          beginTime: params.beginTime,
          endTime: params.endTime
        }
      }
      findCusStatistics(data).then(res => {
        if (params === "all") {
          this.numOptions.xAxis = null;
          this.numOptions.tooltip = {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} 人"
          };
          this.numOptions.series = [
            {
              name:'总览',
              type:'pie',
              radius : "50%",
              center : ['50%', '55%'],
              data:[
                { value: res.tableData[0].all, name: '总用户数量' },
                { value: res.tableData[0].old, name: '老客数量' },
                { value: res.tableData[0].new, name: '新客数量' }
              ]
            }
          ];
          return false;
        } else {
          this.numOptions.xAxis = [
            {
              type: 'category',
              axisTick: { show: false },
              data: []
            }
          ];
          this.numOptions.tooltip = {
            trigger: 'axis',
            formatter: "{b} <br/>{a0} : {c0} 人<br/>{a1} : {c1} 人<br/>{a2} : {c2} 人",
            axisPointer: {
              type: 'shadow'
            }
          };
          this.numOptions.series = [
            {
              name: '总用户数量',
              type: 'bar',
              barGap: 0,
              barWidth: 10,
              data: []
            },
            {
              name: '老客数量',
              type: 'bar',
              barWidth: 10,
              data: []
            },
            {
              name: '新客数量',
              type: 'bar',
              barWidth: 10,
              data: []
            }
          ];
        }
        let data = {all: [], new: [], old: [], dates: []};
        res.tableData = _.sortBy(res.tableData, item => item.time);
        for (var i = 0; i < res.tableData.length; i++) {
          data.dates.push(res.tableData[i]["date"]);
          data.all.push(res.tableData[i]["all"]);
          data.new.push(res.tableData[i]["new"]);
          data.old.push(res.tableData[i]["old"]);
        }
        this.numOptions.xAxis[0].data = data.dates;
        this.numOptions.series[0].data = data.all;
        this.numOptions.series[1].data = data.old;
        this.numOptions.series[2].data = data.new;
      })
    },
    handleSetTransChart(params) {
      let data;
      if (typeof params == "string") {
        data = {
          type: params
        }
      } else {
        data = {
          beginTime: params.beginTime,
          endTime: params.endTime
        }
      }
      findCusPresentation(data).then(res => {
        if (params === "all") {
          this.transOptions.xAxis = null;
          this.transOptions.tooltip = {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} %"
          };
          let fasTurnCus = parseFloat(res.tableData[0]["fasTurnCus"]) * 100;
          let orderTwoToOne = parseFloat(res.tableData[0]["orderTwoToOne"]) * 100;
          this.transOptions.series = [
            {
              name:'总览',
              type:'pie',
              radius : "50%",
              center : ['50%', '55%'],
              data:[
                { value: fasTurnCus.toFixed(2), name: '转化率' },
                { value: orderTwoToOne.toFixed(2), name: '复购率' }
              ]
            }
          ];
          return false;
        } else {
          this.transOptions.xAxis = [
            {
              type: 'category',
              axisTick: { show: false },
              data: []
            }
          ];
          this.transOptions.tooltip = {
            trigger: 'axis',
            formatter: "{b} <br/>{a0} : {c0} %<br/>{a1} : {c1} %",
            axisPointer: {
              type: 'shadow'
            }
          };
          this.transOptions.series = [
            {
              name: '转化率',
              type: 'line',
              smooth: true,
              data: []
            },
            {
              name: '复购率',
              type: 'line',
              smooth: true,
              data: []
            }
          ]
        }
        let data = {tans: [], rerate: [], dates: []};
        res.tableData = _.sortBy(res.tableData, item => item.time);
        for (var i = 0; i < res.tableData.length; i++) {
          data.dates.push(res.tableData[i]["date"]);
          let fasTurnCus = parseFloat(res.tableData[i]["fasTurnCus"]) * 100;
          data.tans.push(fasTurnCus.toFixed(2));
          let orderTwoToOne = parseFloat(res.tableData[i]["orderTwoToOne"]) * 100;
          data.rerate.push(orderTwoToOne.toFixed(2));
        }
        this.transOptions.xAxis[0].data = data.dates;
        this.transOptions.series[0].data = data.tans;
        this.transOptions.series[1].data = data.rerate;
      })
    },
    handleGetPieChartData() {
      pcFindPresentation({ industryId: this.$store.getters.industryId }).then(res => {
        let data = res.tableData;
        if (data) {
          this.lifeCycleOptions.series[0].data[0].value = data.loyalCus.num;
          this.lifeCycleOptions.series[0].data[0].rate = (parseFloat(data.loyalCus.calculation) * 100).toFixed(0);
          this.lifeCycleOptions.series[0].data[1].value = data.activeCus.num;
          this.lifeCycleOptions.series[0].data[1].rate = (parseFloat(data.activeCus.calculation) * 100).toFixed(0);
          this.lifeCycleOptions.series[0].data[2].value = data.lossCus.num;
          this.lifeCycleOptions.series[0].data[2].rate = (parseFloat(data.lossCus.calculation) * 100).toFixed(0);

          this.latentOptions.series[0].data[0].value = data.fans.num;
          this.latentOptions.series[0].data[0].rate = (parseFloat(data.fans.calculation) * 100).toFixed(0);
          this.latentOptions.series[0].data[1].value = data.accessNoOrder.num;
          this.latentOptions.series[0].data[1].rate = (parseFloat(data.accessNoOrder.calculation) * 100).toFixed(0);

          this.activeOptions.series[0].data[0].value = data.newActiveNum.num;
          this.activeOptions.series[0].data[0].rate = (parseFloat(data.newActiveNum.calculation) * 100).toFixed(0);
          this.activeOptions.series[0].data[1].value = data.oftenActiveNum.num;
          this.activeOptions.series[0].data[1].rate = (parseFloat(data.oftenActiveNum.calculation) * 100).toFixed(0);
          this.activeOptions.series[0].data[2].value = data.loyalActiveNum.num;
          this.activeOptions.series[0].data[2].rate = (parseFloat(data.loyalActiveNum.calculation) * 100).toFixed(0);

          this.lostOptions.series[0].data[0].value = data.silentNum.num;
          this.lostOptions.series[0].data[0].rate = (parseFloat(data.silentNum.calculation) * 100).toFixed(0);
          this.lostOptions.series[0].data[1].value = data.lossCustom.num;
          this.lostOptions.series[0].data[1].rate = (parseFloat(data.lossCustom.calculation) * 100).toFixed(0);
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-view {
  overflow:hidden;
  margin: 20px;
  background:#f0f2f5;
  .chart-views {
    background:#fff;
    margin-bottom: 15px;
  }
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
/* 自适应 */
@media screen and (min-width: 1400px) {
  .trans-chart, .latent-chart, .lost-chart {
    float: right;
  }
}
@media screen and (max-width: 1440px) {
  .trans-chart, .latent-chart, .lost-chart {
    float: left;
  }
  .chart-views {
    width: 60%!important;
    min-width: 1000px!important;
  }
}
</style>