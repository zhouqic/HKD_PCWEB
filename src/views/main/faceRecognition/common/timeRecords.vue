<template>
  <panel-group title="到店时间分布" :width="width" :style="{float: position}">
    <template slot="tools">
      <el-select style="width:120px;" v-model="time" @change="handleOnTimeChange">
        <el-option :value="3" label="最近三个月"></el-option>
        <el-option :value="6" label="最近半年"></el-option>
        <el-option :value="12" label="最近一年"></el-option>
      </el-select>
    </template>
    <template slot="content">
      <div style="height:260px;" ref="chart"></div>
    </template>
  </panel-group>
</template>
<script>
import echarts from "echarts";
import { debounce } from "@/utils";
import panelGroup from "./panelGroup";
import { findUserInfoByFaceId } from '@/api/face';
export default {
  props: ["id", "width", "position"],
  components: { panelGroup },
  data() {
    return {
      time: 3,
      chart: null,
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          top: 35,
          bottom: 70
        },
        dataZoom: [
          {
            type: "inside"
          },
          {
            type: "slider"
          }
        ],
        xAxis: {
          data: [],
          silent: false,
          splitLine: {
            show: false
          },
          splitArea: {
            show: false
          }
        },
        yAxis: {
          name: "次数",
          minInterval: 1,
          splitArea: {
            show: false
          }
        },
        series: [
          {
            type: "bar",
            data: [],
            // Set `large` for large data amount
            large: true
          }
        ]
      }
    };
  },
  watch: {
    id(val) {
      this.handleGetChartData();
    }
  },
  mounted() {
    this.handleGetChartData();
  },
  methods: {
    handleOnTimeChange(val) {
      this.time = val;
      this.handleGetChartData();
    },
    handleGetChartData() {
      if (this.id) {
        findUserInfoByFaceId({id: this.id, time: this.time}).then(res=> {
          this.options.xAxis.data = res.tableData.time;
          this.options.series[0].data = res.tableData.count;
          this.initChart();
          this.__resizeHandler = debounce(() => {
            if (this.chart) {
              this.chart.resize();
            }
          }, 100);
          window.addEventListener("resize", this.__resizeHandler);
        });
      }
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.handleSetOptions(this.options);
    },
    handleSetOptions(option) {
      if (this.btnType == "all") {
        this.chart.dispose();
        this.chart = echarts.init(this.$refs.chart);
      }
      this.chart.setOption(option);
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    window.removeEventListener("resize", this.__resizeHandler);

    this.chart.dispose();
    this.chart = null;
  }
};
</script>