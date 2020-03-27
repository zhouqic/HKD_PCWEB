<template>
<div class="main-content">
  <!-- 添加活动 -->
  <el-header style="padding-left:0;">
    <span class="item_label" style="font-size:14px;color:#606266;line-height:32px;font-weight:bolder;">活动状态：</span>
    <el-select v-model="status" @change="handleGetTableData()" style="width:120px;margin-right:80px;">
      <el-option label="进行中" :value="3"></el-option>
      <el-option label="已结束" :value="1"></el-option>
      <el-option label="未开始" :value="2"></el-option>
    </el-select>
    <el-button type="primary" @click="handleOpenDialog()">添加活动</el-button>
  </el-header>
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="名称" prop="name"></el-table-column>

    <el-table-column label="开始时间">
      <template slot-scope="scope">
        {{ scope.row.beginDate | parseTime('{y}-{m}-{d} {h}:{m}') }}
      </template>
    </el-table-column>

    <el-table-column label="结束时间">
      <template slot-scope="scope">
        {{ scope.row.endDate | parseTime('{y}-{m}-{d} {h}:{m}') }}
      </template>
    </el-table-column>

    <el-table-column label="消耗积分" prop="">
      <template slot-scope="scope">
        {{ scope.row.costPoints }} 积分  / 每次
      </template>
    </el-table-column>

    <el-table-column label="参与次数">
      <template slot-scope="scope">
        {{ scope.row.maxNumbers != -1 ? (scope.row.maxNumbers + " 次 / 每人") : "不限次数" }}
      </template>
    </el-table-column>

    <el-table-column label="总中奖概率">
      <template slot-scope="scope">
        {{ parseFloat(scope.row.probability).toFixed(1) + '%' }}
      </template>
    </el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status == 3" type="success">进行中</el-tag>
        <el-tag v-else-if="scope.row.status == 2" type="info">未开始</el-tag>
        <el-tag v-else-if="scope.row.status == 1" type="danger">已结束</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="创建日期">
      <template slot-scope="scope">
        {{ scope.row.beginDate | parseTime('{y}-{m}-{d} {h}:{m}:{s}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="250px">
      <template slot-scope="scope">
        <el-button class="table_operate" v-if="scope.row.status == 2" plain type="primary" @click="handleOpenEditDIalog(scope.row.wheelId)">编辑</el-button>
        <el-button class="table_operate" v-else-if="scope.row.status == 0" plain type="danger" @click="handleFinishWheel(scope.row.wheelId)">结束活动</el-button>
        <el-button class="table_operate" plain @click="handleShowDetail(scope.row)">查看详情</el-button>
        <el-button class="table_operate" plain @click="handleFindAwardById(scope.row.wheelId)">统计</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 添加编辑活动、详情 -->
  <el-dialog :title="dialogType == 3 ? '活动详情' : '活动设置'" :visible.sync="showDialog" width="550px" @close="showDialog=false;id='';data={};" :close-on-click-modal="false" :close-on-press-escape="false">
    <!-- 活动设置 -->
    <points-draw-form ref="pointsDrawForm" v-if="showDialog && (dialogType == 1 || dialogType == 2)" :id="id"></points-draw-form>

    <!-- 详情 -->
    <points-draw-detail ref="pointsDrawDetail" v-if="showDialog && dialogType == 3" :data="data"></points-draw-detail>

    <span slot="footer" class="dialog-footer">
      <el-button v-if="showDialog && dialogType != 3" @click="showDialog=false;id=''">取 消</el-button>
      <el-button v-if="showDialog && dialogType != 3" type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
      <el-button v-else type="primary" @click="showDialog=false;data={};">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 活动统计 -->
  <el-dialog title="活动统计" :visible.sync="showWheelInfo" width="550px" @close="showWheelInfo=false;wheelId=''" :close-on-click-modal="false" :close-on-press-escape="false">
    <points-draw-statistic v-if="showWheelInfo" :id="wheelId"></points-draw-statistic>

    <span slot="footer" class="dialog-footer">
      <el-button @click="showWheelInfo=false;wheelId=''">取 消</el-button>
      <el-button type="primary" @click="showWheelInfo=false;wheelId=''">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { wheelInfoList, finishWheelInfo, addWheelInfo } from '@/api/marketCenter';
import pointsDrawForm from './pointsDrawForm';
import pointsDrawDetail from './pointsDrawDetail';
import pointsDrawStatistic from './pointsDrawStatistic';

  export default {
    components: { pointsDrawForm, pointsDrawDetail, pointsDrawStatistic },
    data() {
      return {
        id: "",
        data: {},
        dialogType: "",//弹窗类型：1，添加；2，编辑；3，详情；4，统计
        tableData: [],
        status: 3,// 3，进行中；2未开始；1，已结束
        isSubmit: false,
        showWheelInfo: false,
        showDialog: false
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleGetTableData() {
        wheelInfoList({ status: this.status }).then(res => {
          this.tableData = res.tableData.forEach(item => {
            item.probability = 0;
            item.wheelInfoSets.forEach(sets => item.probability += sets.probability);
          })
          this.tableData = res.tableData;
        })
      },
      handleOpenDialog() {
        this.dialogType = 1;
        this.showDialog = true;
      },
      handleOpenEditDIalog(id) {
        this.id = id;
        this.dialogType = 2;
        this.showDialog = true;
      },
      handleShowDetail(row) {
        this.data = row;
        this.dialogType = 3;
        this.showDialog = true;
      },
      handleFindAwardById(id) {
        this.wheelId = id;
        this.showWheelInfo = true;
      },
      handleFinishWheel(id) {
        this.$confirm('您确认要结束该活动吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          finishWheelInfo({ wheelId: id }).then(res => {
            this.$message.success("活动已结束");
            this.handleGetTableData();
          })
        }).catch(() => {});
      },
      handleSubmitForm() {
        let $el = this.$refs["pointsDrawForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            if ($el.formData.wheelInfoSets.length < 4) {
              this.$message.error("请至少选择4个奖项");
              return false;
            }
            if (new Date($el.formData.beginDate).getTime() == new Date($el.formData.endDate).getTime()) {
              this.$message.error("开始时间不能等于结束时间");
              return false;
            }
            this.isSubmit = true;
            delete $el.formData.activityDate;
            addWheelInfo($el.formData).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.handleGetTableData();
              this.$message.success("保存成功");
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        })
      }
    }
  }
</script>