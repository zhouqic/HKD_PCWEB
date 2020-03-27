<template>
<div class="main-content" style="padding: 20px 20px;">
  <!-- 列表 -->
  <el-table :data="tableData" style="margin-bottom: 15px;">
    <el-table-column label="红包名称" prop="command"></el-table-column>

    <el-table-column label="红包类型">
      <template slot-scope="scope">
        {{ scope.row.type == "IMMEDIATELY" ? "即时红包" : "定时红包" }}
      </template>
    </el-table-column>

    <el-table-column label="红包总额">
      <template slot-scope="scope">
        {{ "￥" + scope.row.red_packet_money }}
      </template>
    </el-table-column>

    <el-table-column label="红包总数">
      <template slot-scope="scope">
        {{ scope.row.num + "个" }}
      </template>
    </el-table-column>

    <el-table-column label="已抢金额">
      <template slot-scope="scope">
        {{ "￥" + scope.row.get_money }}
      </template>
    </el-table-column>

    <el-table-column label="已抢个数">
      <template slot-scope="scope">
        {{ scope.row.get_num + "个" }}
      </template>
    </el-table-column>

    <el-table-column label="活动状态">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.status == 1 && scope.row.num > scope.row.get_num" type="success">疯抢中</el-tag>
        <el-tag v-else-if="scope.row.status == 1 && scope.row.leak_time_stamp > new Date().getTime()" type="info">未开始</el-tag>
        <el-tag v-else type="danger">已结束</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="发布时间">
      <template slot-scope="scope">
        {{ scope.row.leak_time }}
      </template>
    </el-table-column>
    
    <el-table-column label="退款时间">
      <template slot-scope="scope">
        {{ scope.row.refund_date | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
      </template>
    </el-table-column>

    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
        <el-button class="table_operate" plain type="primary" @click="handleGetRedpacketDetail(scope.row.id)">领取记录</el-button>
        <el-button class="table_operate" plain type="primary" @click="handleGetRedpacketStatistic(scope.row.id)">数据分析</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页 -->
  <el-row>
    <el-col :span="6" style="font-size: 13px;line-height: 32px;">
      红包数量 <span style="color:#F56C6C;">{{ statistics.num ? statistics.num : 0 }}</span> 个， 红包总额 <span style="color:#F56C6C;">{{ statistics.money ? statistics.money : 0 }}</span> 元
    </el-col>
    <el-col :span="18">
      <el-pagination @current-change="handleOnPageChange" :current-page="page" layout="total, prev, pager, next, jumper" :total="total" :page-size="5"></el-pagination>
    </el-col>
  </el-row>
  <!-- 弹窗 -->
  <el-dialog :title="dialogType == 'detail' ? '红包详情' : '数据分析'" :visible.sync="showDialog" width="650px" :close-on-click-modal="false" :close-on-press-escape="false" @close="dialogType='';id='';">
    <!-- 详情 -->
    <redpacket-detail :id="id" v-if="dialogType == 'detail'"></redpacket-detail>
    <!-- 数据分析 -->
    <redpacket-statistic :id="id" v-else-if="dialogType == 'statistic'"></redpacket-statistic>
    <!-- 添加红包 -->
    <!-- <redpacket-form ref="redpacketForm" v-else-if="showDialog && !id"></redpacket-form> -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 支付二维码 -->
  <el-dialog title="支付订单" class="pay-dialog" center :visible.sync="showQRcodeDialog" width="300px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showQRcodeDialog = false;">
    <div id="qrcode" ref="qrcode"></div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="showQRcodeDialog = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>
<script>
import { getRedPacketOfShop, saveRfCommandRedPacket } from '@/api/marketCenter';
import redpacketDetail from "./redpacketDetail";
import redpacketForm from "./redpacketForm";
import redpacketStatistic from "./redpacketStatistic";
import QRCode from 'qrcodejs2';

  export default {
    components: { redpacketDetail, redpacketForm, QRCode, redpacketStatistic },
    data() {
      return {
        tableData: [],
        statistics: {},
        page: 1,
        total: 0,
        dialogType: '',//detail,详情；statistic，统计
        showDialog: false,
        showQRcodeDialog: false,
        isSubmit: false,
        id: ""
      }
    },
    created() {
      this.handleGetTableData();
    },
    methods: {
      handleOnPageChange(page) {
        this.page = page;
        this.handleGetTableData();
      },
      handleSubmitForm() {
        let $el = this.$refs["redpacketForm"];
        $el.$refs["validateForm"].validate(valid => {
          if (valid) {
            this.isSubmit = true;
            let data = {
              flag: 0,
              command: $el.formData.command,
              redPacketMoney: $el.formData.redPacketMoney,
              num: $el.formData.num,
              type: $el.formData.type,
              receiveRange: $el.formData.receiveRange,
              publishTime: $el.formData.publishTime
            };
            saveRfCommandRedPacket(data).then(res => {
              this.isSubmit = false;
              this.showDialog = false;
              this.showQRcodeDialog = true;
              this.$message.success("保存成功");
              // 生成二维码
              this.$nextTick(() => {
                new QRCode('qrcode', {
                  width: 250,
                  height: 250,
                  text: res.tableData.mweburl + "&prepay_id=" + res.tableData.orderId + "&redirect_url=" + res.tableData.redirectUrl,
                  colorDark : '#000000', // 前景色
                  colorLight : '#ffffff', // 背景色
                  correctLevel : QRCode.CorrectLevel.H  // 容错级别，
                })
              })
            }).catch(() => { 
              this.isSubmit = false;
            });
          }
        })
      },
      handleGetTableData() {
        getRedPacketOfShop({ pageNo: this.page }).then(res => {
          this.total = res.totalSize;
          this.tableData = res.businessData.data;
          this.statistics = res.businessData.statistics;
        })
      },
      handleGetRedpacketDetail(id) {
        this.id = id;
        this.dialogType = "detail";
        this.showDialog = true;
      },
      handleGetRedpacketStatistic(id) {
        this.id = id;
        this.dialogType = "statistic";
        this.showDialog = true;
      }
    }
  }
</script>
<style>
.pay-dialog img {
  display: inline-block!important;
}
</style>
