<template>
  <div>
    <el-row style="margin-bottom:15px;">
      <el-button type="primary" @click="showGroupDialog=true">新建人群</el-button>
    </el-row>
    <!-- 人群库 -->
    <el-row :gutter="20">
      <template v-for="item in tableData">
        <el-col class="col-item" :key="item.typeId" :xs="8" :sm="8" :md="8" :lg="8" :xl="6">
          <div class="grid-content">
            <div class="title">{{ item.consumName }}</div>
            <div class="desc" style="height:60px;">
              <span>消费时间：近{{item.timeType}}个月；</span>
              <template v-if="item.consumMaxMoney !== '' || item.consumMinMoney !== ''">
                <span v-if="item.consumMaxMoney === '' && item.consumMinMoney !== ''">消费金额：{{item.consumMinMoney}}元以上；</span>
                <span v-else-if="item.consumMinMoney === '' && item.consumMaxMoney !== ''">消费金额：0元-{{item.consumMaxMoney}}元；</span>
                <span v-else>消费金额：{{item.consumMinMoney}}元-{{item.consumMaxMoney}}元；</span>
              </template>
              <template v-if="item.consumMaxNum !== '' || item.consumMinNum !== ''">
                <span v-if="item.consumMaxNum === '' && item.consumMinNum !== ''">消费次数：{{item.consumMinNum}}次以上；</span>
                <span v-else-if="item.consumMinNum === '' && item.consumMaxNum !== ''">消费次数：0-{{item.consumMaxNum}}次；</span>
                <span v-else>消费次数：{{item.consumMinNum}}-{{item.consumMaxNum}}次；</span>
              </template>
            </div>
            <div class="desc">人群数量：{{item.count}}</div>
            <div class="tool">
              <el-button type="danger" plain @click="handleDeleteGroup(item.typeId)">删除</el-button>
              <el-button type="primary" plain @click="handleEditGroup(item)">编辑</el-button>
              <template v-if="$store.state.permission.showYingXiao === true">
                <el-button type="primary" :disabled="item.count <= 0 ? true : false" :title="item.count <= 0 ? '人群数量为0，不可发送' : ''" @click="handleOpenCardDialog(item.typeId)">群发优惠券</el-button>
              </template>
            </div>
          </div>
        </el-col>
      </template>
    </el-row>
    <!-- 人群弹窗 -->
    <el-dialog title="人群设置" :visible.sync="showGroupDialog" width="500px" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseDialog">
      <el-form ref="groupSetForm" :model="groupData" :rules="groupRules" label-width="80px" :label-position="'left'">
        <el-form-item label="人群名称:" prop="consumName">
          <el-input v-model="groupData.consumName" placeholder="最多输入10个字符" maxlength="10" style="width:90%;"></el-input>
        </el-form-item>
        <el-form-item label="消费时间:">
          <el-select v-model="groupData.timeType" style="width:90%;">
            <el-option label="近一个月" :value="1"></el-option>
            <el-option label="近三个月" :value="3"></el-option>
            <el-option label="近六个月" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消费数据" label-width="180px"></el-form-item>
        <el-form-item  prop="consumMinMoney">
          <el-checkbox label="单次消费金额" v-model="showConsumMoney"></el-checkbox>
          <el-input v-model.number="groupData.consumMinMoney" :disabled="showConsumMoney ? false : true" maxlength="7" style="width:100px;"></el-input>元-
          <el-input v-model.number="groupData.consumMaxMoney" :disabled="showConsumMoney ? false : true" maxlength="7" style="width:100px;"></el-input>元
        </el-form-item>
        <el-form-item prop="consumMinNum">
          <el-checkbox label="消费次数" v-model="showConsumNum"></el-checkbox>
          <el-input v-model.number="groupData.consumMinNum" :disabled="showConsumNum ? false : true" maxlength="7" style="width:100px;"></el-input>次-
          <el-input v-model.number="groupData.consumMaxNum" :disabled="showConsumNum ? false : true" maxlength="7" style="width:100px;"></el-input>次
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseDialog">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleSubmitForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 发券弹窗 -->
    <el-dialog title="选择优惠券" :visible.sync="showCardDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @closed="handleCloseCardDialog">
      <el-form ref="validateForm" :model="sendData" label-width="120px" :label-position="'left'">
        <el-form-item label="券类型:">
          <el-checkbox label="优惠券" v-model="showYCard"></el-checkbox>
          <el-checkbox label="商品券" v-model="showSCard"></el-checkbox>
        </el-form-item>
        <el-form-item label="选择优惠券:" v-if="showYCard">
          <el-select v-model="sendData.cardId" multiple placeholder="请选择一张或者多张优惠券" style="width:80%;">
            <el-option v-for="item in YCardList" :key="item.value" :label="item.title" :value="item.id">
              <span style="float: left">{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 12px;">{{ '满' + item.leastCost + '元，减' + item.reduceCost + '元' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择商品券:" v-if="showSCard">
          <el-select v-model="sendData.exchangIds" multiple placeholder="请选择一张或者多张商品券" style="width:80%;">
            <el-option v-for="item in SCardList" :key="item.value" :label="item.title" :value="item.id">
              <span style="float: left"><img :src="item.pic" width='20' height='20' style='border-radius:50%;vertical-align: -7px;margin-right:10px;'>{{ item.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px;padding-right: 12px;">{{ '价值 ￥' + item.price }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseCardDialog">取 消</el-button>
        <el-button type="primary" :disabled="isSubmit ? true : false" @click="handleOnSendCards">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getMemberCondition, saveCondition, deleteConditionById, getGroupCount } from "@/api/vipManage";
import { isValidPrice } from "@/utils/validate";
import { sendCards, getRfCardsByCreaterId } from '@/api/vipManage';
import { findEntityCardList } from '@/api/marketCenter';

export default {
  data() {
    const validName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入人群名称，最多10个字符"));
      } else {
        callback();
      }
    }
    const validMoney = (rule, value, callback) => {
      if (this.showConsumMoney && this.groupData.consumMinMoney === '' && this.groupData.consumMaxMoney === '') {
        callback(new Error("请输入大于等于0的数字"));
        return false;
      }
      if (this.showConsumMoney && (this.groupData.consumMinMoney < 0 || isNaN(this.groupData.consumMinMoney))) {
        callback(new Error("请输入大于等于0的数字"));
        return false;
      }
      if (this.showConsumMoney && isNaN(this.groupData.consumMaxMoney)) {
        callback(new Error("请输入大于0的数字"));
        return false;
      }
      if (this.showConsumMoney && this.groupData.consumMaxMoney !== '' && this.groupData.consumMaxMoney <= 0) {
        callback(new Error("消费金额最大值必须大于0"));
        return false;
      }
      if (parseFloat(this.groupData.consumMinMoney) >= parseFloat(this.groupData.consumMaxMoney)) {
        callback(new Error("单次消费金额最大值必须大于最小值"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (this.showConsumNum && this.groupData.consumMinNum === '' && this.groupData.consumMaxNum === '') {
        callback(new Error("请输入大于等于0的数字"));
        return false;
      }
      if (this.showConsumNum && (this.groupData.consumMinNum < 0 || isNaN(this.groupData.consumMinNum))) {
        callback(new Error("请输入大于等于0的数字"));
        return false;
      }
      if (this.showConsumMoney && isNaN(this.groupData.consumMaxNum)) {
        callback(new Error("请输入大于0的数字"));
        return false;
      }
      if (this.showConsumNum && this.groupData.consumMaxNum !== ''  && this.groupData.consumMaxNum <= 0) {
        callback(new Error("消费次数最大值必须大于0"));
        return false;
      }
      if (parseFloat(this.groupData.consumMinNum) >= parseFloat(this.groupData.consumMaxNum)) {
        callback(new Error("消费次数最大值必须大于最小值"));
        return false;
      }
      callback();
    }
    return {
      tableData: [],
      isSubmit: false,
      showGroupDialog: false,
      showConsumNum: false,
      showConsumMoney: false,
      groupData: {
        consumName: '',
        consumMinNum: '',
        consumMaxNum: '',
        consumMinMoney: '',
        consumMaxMoney: '',
        typeId: '',
        timeType: 3
      },
      groupRules: {
        consumName: [
          { validator: validName.bind(this), trigger: "change" },
          { validator: validName.bind(this), trigger: "blur" },
        ],
        consumMinMoney: [
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" },
        ],
        consumMinNum: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" },
        ],
      },
      showCardDialog: false,
      showYCard: false,
      showSCard: false,
      YCardList: [],
      SCardList: [],
      sendData: {
        ids: 0,
        typeId: '',
        cardId: [],
        exchangIds: []
      },
    };
  },
  watch: {
    showYCard(newVal, oldVal) {
      if (!newVal) {
        return this.YCardList = [];
      }
      getRfCardsByCreaterId({}).then(res => {
        return this.YCardList = res.tableData
      });
    },
    showSCard(newVal, oldVal) {
      if (!newVal) {
        return this.SCardList = [];
      }
      findEntityCardList({}).then(res => {
        return this.SCardList = res.tableData
      });
    }
  },
  created() {
    this.handleGetCardData();
  },
  methods: {
    handleGetCardData() {
      getMemberCondition().then(res => {
        this.tableData = res.tableData;
        this.tableData.forEach(item => {
          getGroupCount({typeId: item.typeId}).then(res => {
            item.count = res.tableData;
            this.$forceUpdate();
          })
        })
      })
    },
    handleCloseDialog() {
      this.showGroupDialog = false;
      this.showConsumNum = false;
      this.showConsumMoney = false;
      this.groupData = {
        consumName: '',
        consumMinNum: '',
        consumMaxNum: '',
        consumMinMoney: '',
        consumMaxMoney: '',
        typeId: '',
        timeType: 3
      };
      this.$refs["groupSetForm"].clearValidate();
    },
    handleSubmitForm() {
      if (!this.showConsumNum) {
        this.groupData.consumMinNum = '';
        this.groupData.consumMaxNum = '';
      }
      if (!this.showConsumMoney) {
        this.groupData.consumMinMoney = '';
        this.groupData.consumMaxMoney = '';
      }
      if (!this.showConsumNum && !this.showConsumMoney) {
        this.groupData.consumMinNum = 0;
        this.groupData.consumMinMoney = 0;
      }
      this.$refs["groupSetForm"].validate(valid => {
        if (valid) {
          this.isSubmit = true;
          saveCondition(this.groupData).then(() => {
            this.isSubmit = false;
            this.$message.success("保存成功");
            this.handleCloseDialog();
            this.handleGetCardData();
          }).catch(() => { this.isSubmit = false; })
        }
      })
    },
    handleEditGroup(data) {
      Object.keys(this.groupData).forEach(key => {
        this.groupData[key] = data[key];
      });
      this.groupData.timeType = parseFloat(this.groupData.timeType);
      if (this.groupData.consumMinNum || this.groupData.consumMaxNum) {
        this.showConsumNum = true;
      }
      if (this.groupData.consumMinMoney || this.groupData.consumMaxMoney) {
        this.showConsumMoney = true;
      }
      this.showGroupDialog = true;
    },
    handleDeleteGroup(id) {
      this.$confirm(`您确定要删除该人群库吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteConditionById({typeId:id}).then(() => {
          this.$message.success('删除成功');
          this.handleGetCardData();
        })
      }).catch(() => {});
    },
    handleOpenCardDialog(id) {
      this.showCardDialog = true;
      this.sendData.typeId = id;
    },
    handleCloseCardDialog() {
      this.sendData.ids = 0;
      this.sendData.typeId = '';
      this.sendData.cardId = [];
      this.sendData.exchangIds = [];
      this.showCardDialog = false;
      this.showYCard = false;
      this.showSCard = false;
    },
    handleOnSendCards() {
      if (!this.showYCard && !this.showSCard) {
        this.$message.error("请至少选择一种券");
        return false;
      }
      if (this.showYCard && this.sendData.cardId.length == 0) {
        this.$message.error("请选择要发送的优惠券");
        return false;
      }
      if (this.showSCard && this.sendData.exchangIds.length == 0) {
        this.$message.error("请选择要发送的商品券");
        return false;
      }
      let data = {};
      data.ids = this.sendData.ids;
      data.typeId = this.sendData.typeId;
      data.cardId = this.showYCard ? this.sendData.cardId.join(",") : null;
      data.exchangIds = this.showSCard ? this.sendData.exchangIds.join(",") : null;
      sendCards(data).then(res => {
        this.isSubmit = false;
        this.showCardDialog = false;
        this.$message.success("发送成功");
      }).catch(() => { 
        this.isSubmit = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.col-item {
  border-radius: 4px;
  margin-bottom: 20px;
  max-width: 320px;
  .grid-content {
    color: #000;
    background: #d7d7d7;
    border-radius: 4px;
    padding: 15px;
    padding-right: 10px;
    overflow: hidden;
    cursor: pointer;
    div.title {
      font-size: 17px;
      line-height: 30px;
      margin-bottom: 10px;
    }
    div.desc {
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>