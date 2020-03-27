<template>
  <div class="chart-views">
    <div class="ibox-title">
      <h5>{{ title }}</h5>
      <div class="pull-right" v-if="showTools">
        <div class="btn-group">
          <button type="button" class="btn btn-xs btn-white" :class="{'active': btnType == 'day' ? true: false}" @click="handleOnBtnClick('day')">日</button>
          <button type="button" class="btn btn-xs btn-white" :class="{'active': btnType == 'week' ? true: false}" @click="handleOnBtnClick('week')">周</button>
          <button type="button" class="btn btn-xs btn-white" :class="{'active': btnType == 'month' ? true: false}" @click="handleOnBtnClick('month')">月</button>
          <button type="button" class="btn btn-xs btn-white" :class="{'active': btnType == 'all' ? true: false}" @click="handleOnBtnClick('all')">全部</button>
          <div class="custom-date" v-if="btnType=='custom'">
            <div style="margin-bottom: 10px;">开始时间：
              <el-date-picker v-model="beginTime" :clearable="false" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div style="margin-bottom: 10px;">结束时间：
              <el-date-picker v-model="endTime" :clearable="false" type="date" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div class="searcTime" @click="handleOnDateChange()">提交</div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="echarts" ref="chart"></div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import { debounce } from '@/utils'

export default {
  name: "chart",
  props: ["title", "showTools", "options"],
  data() {
    return {
      chart: null,
      btnType: 'day',
      beginTime: "",
      endTime: ""
    }
  },
  watch: {
    options: {
      deep: true,
      handler(val) {
        this.handleSetOptions(val)
      }
    }
  },
  mounted() {
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize()
      }
    }, 100);
    window.addEventListener('resize', this.__resizeHandler);
  },
  methods: {
    handleOnDateChange() {
      if (this.beginTime == "") {
        this.$message.error('请选择开始时间');
        return false;
      }
      if (this.endTime == "") {
        this.$message.error('请选择结束时间');
        return false;
      }
      let start = new Date(this.beginTime).getTime();
      let end = new Date(this.endTime).getTime();
      if (start > end) {
        this.$message.error('开始时间不能大于结束时间');
        return false;
      }
      // 计算出相差天数,大于 90 天无法
      if (Math.floor((end - start) / (24 * 3600 * 1000)) > 90) {
        this.$message.error('当前最多可查询90天内新增用户数据，请重新选择日期');
        return false;
      }
      this.$emit("change", {beginTime: this.beginTime, endTime: this.endTime});
    },
    handleOnBtnClick(type) {
      this.btnType = type;
      if (type == "custom") {
        return false;
      }
      this.$emit("change", type);
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
      this.handleSetOptions(this.options)
    },
    handleSetOptions(option) {
      if (this.btnType == "all") {
        this.chart.dispose();
        this.chart = echarts.init(this.$refs.chart);
      }
      this.chart.setOption(option)
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    window.removeEventListener('resize', this.__resizeHandler)

    this.chart.dispose()
    this.chart = null
  }
}
</script>
<style lang="scss" scoped>
.chart-views {
  width: 45%;
  min-width: 600px;
  .ibox-title {
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
  /* 时间框 */
  .el-date-editor {
    color: #666;
    width: 132px!important;
    font-size: 12px;
  }
  /deep/ .el-input__inner {
    padding-left: 15px;
    height: 24px;
    font-size: 12px;
    color: #666;
  }
  /deep/ .el-input__icon {
    line-height: 24px;
  }
  .custom-date {
    position: absolute;
    right: 0;
    top: 25px;
    border: 1px solid #e7eaec;
    background: #fff;
    padding: 10px;
    font-size: 12px;
    color: #666;
    z-index: 999;
  }
  .searcTime {
    background-color: #169bd5;
    border: 1px solid #169bd5;
    color: #fff;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
  }
}
.echarts {
  height: 280px;
  border-top: 1px solid #e7eaec;
}

.btn-group {
  position: relative;
  display: inline-block;
  top: -3px;
}
.btn-group>.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  text-align: center;
  line-height: 12px;
  cursor: pointer;
  user-select: none;
  background: #fff;
  border: 1px solid #e7eaec;
  border-radius: 4px;
  position: relative;
  float: left;
  border-radius: 3px;
}
.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle) {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {
  border-radius: 0;
}
.btn-group>.btn:last-child:not(:first-child), .btn-group>.dropdown-toggle:not(:first-child) {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.btn.active {
  color: #fff;
  background: #169bd5;
  border-color: #169bd5;
}
</style>