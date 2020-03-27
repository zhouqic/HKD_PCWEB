<template>
  <el-container style="display:block;">
    <!-- 数据统计 -->
    <el-table :data="detailData" border :show-header="false" style="margin-bottom: 15px;">
      <el-table-column prop="key" label="key" width="150">
        <template slot-scope="scope">
          <span style="font-weight: 900;">{{ scope.row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="value">
        <template slot-scope="scope">
          <div v-html="scope.row.value"></div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 活动访问趋势图 -->
    <chart-view title="活动访问趋势图" :options="options"></chart-view>
  </el-container>
</template>

<script>
import { getRedPacketData, getRedPacketStatistics } from '@/api/marketCenter';
import chartView from "./chartView";

  export default {
    props: ["id"],
    components: { chartView },
    data() {
      return {
        options: {
          color: ['#ff5f87', '#ffbb4c', '#86d23a'],
          tooltip: {
            trigger: 'axis',
            formatter: "{b} <br/>{a} : {c} 人",
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['访问人数'],
            top: 20
          },
          xAxis: {
            type: 'category',
            axisTick: { show: false },
            data: []
          },
          yAxis: { show: false, type: 'value' },
          series: [
            {
              name: '访问人数',
              type: 'line',
              data: []
            }
          ]
        },
        detailData: []
      }
    },
    created() {
      getRedPacketData({ id: this.id }).then(res => {
        if (res.tableData) {
          this.detailData = [
            {
              key: "活动访问人次",
              value: res.tableData.accessNum
            },
            {
              key: "参与活动人数",
              value: res.tableData.getNum
            },
            {
              key: "粉丝转化率",
              value: res.tableData.getNum != 0 ? ((parseFloat(res.tableData.getNum/res.tableData.accessNum)*100).toFixed(2)) : "0.00" + "%"
            },
            {
              key: "云店访问人数",
              value: res.tableData.accessShopNum
            },
            {
              key: "消费转化率",
              value: (parseFloat(res.tableData.consumeNum)*100).toFixed(2) + "%"
            }
          ];
        }
      })
      getRedPacketStatistics({ date: "", id: this.id, type: "" }).then(res => {
        if (res.tableData) {
          for (let i = 0; i < res.tableData.length; i++) {
            this.options.xAxis.data.push(res.tableData[i]["date"]);
            this.options.series[0].data.push(res.tableData[i]["count"]);
          }
        }
      })
    }
  }
</script>