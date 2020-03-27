<template>
  <div>
    <!-- 筛选 -->
    <el-form label-width="80px" label-position="left">
      <el-form-item class="inline-block" label="查询日期:">
        <date-picker type="daterange" :value.sync="dateRange" style="width:275px"></date-picker>
      </el-form-item>
      <el-form-item class="inline-block" label="是否去重:">
        <el-select v-model="groupByFlag" style="width:120px">
          <el-option :value="1" label="按天去重"></el-option>
          <el-option :value="0" label="不去重"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label-width="0px">
        <el-button type="primary" @click="page=1;handlerGetImgData()">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片 -->
    <div class="clearfix" style="margin-bottom:15px;">
      <div v-for="item in imgData" :key="item.id" class="img-item fl">
        <img :src="item" width="">
      </div>
    </div>
    <!-- 分页 -->
    <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="10"></el-pagination>
  </div>
</template>
<script>
import DatePicker from "@/components/DatePicker";
import { findUserUrlByPage } from "@/api/face";
export default {
  props: ["id", "value"],
  components: { DatePicker },
  data() {
    return {
      dateRange: this.value,
      groupByFlag: 1,
      imgData: [],
      page: 1,
      total: 0,
    };
  },
  created() {
    this.handlerGetImgData();
  },
  methods: {
    handleOnPageChange(page) {
      this.page = page;
      this.handlerGetImgData();
    },
    handlerGetImgData() {
      findUserUrlByPage({beginTime:this.dateRange[0], endTime:this.dateRange[1], groupByFlag:this.groupByFlag, currentPage:this.page, id:this.id}).then(res => {
        this.imgData = res.tableData.records;
        this.total = res.tableData.total;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.img-item {
  padding: 10px 15px;
  margin-right: 16px;
  margin-bottom: 16px;
  border: 4px solid #2d8cf0;
  img {
    width: 110px;
  }
}
</style>