<template>
<el-container>
  <el-form ref="validateForm" :model="formData" :rules="formRules" label-width="110px" :label-position="'right'" style="width:100%;">
    <!--  -->
    <el-form-item label="活动类型:" v-if="type == 0">
      <el-radio-group v-model="formData.needFees">
        <el-radio :label="0">免费会员卡</el-radio>
        <el-radio :label="1">付费会员卡</el-radio>
      </el-radio-group>
    </el-form-item>
    <!--  -->
    <el-form-item v-if="formData.needFees === 1 || type == 1" :label="type == 0 ? '开卡金额:' : '礼包金额:'" prop="fees">
      <el-input v-model="formData.fees" maxlength="7">
        <template slot="append">元</template>
      </el-input>
    </el-form-item>
    <!--  -->
    <el-form-item label="开卡礼包:">
      <el-checkbox label="积分" v-model="showPoint" @change="hanleOnCheckboxChange(1)"></el-checkbox>
      <el-checkbox label="现金红包" v-model="showPacket" @change="hanleOnCheckboxChange(2)"></el-checkbox>
      <el-checkbox label="优惠券" v-model="showCard" @change="hanleOnCheckboxChange(3)"></el-checkbox>
      <el-checkbox label="商品赠送" v-model="showExchange" @change="hanleOnCheckboxChange(4)"></el-checkbox>
    </el-form-item>
    <!--  -->
    <el-form-item v-if="showPoint" label="积分:" prop="point">
      <el-input v-model="formData.point" maxlength="5">
        <template slot="prepend">赠送</template>
        <template slot="append">积分</template>
      </el-input>
    </el-form-item>
    <!--  -->
    <el-form-item v-if="showPacket" label="现金红包:" prop="redPacket">
      <el-input v-model="formData.redPacket" maxlength="5">
        <template slot="prepend">赠送</template>
        <template slot="append">元</template>
      </el-input>
      <div style="color:#DCDFE6;">提示：会员领取后，将存入会员账户余额，不可提现</div>
    </el-form-item>
    <!-- 优惠券集合 -->
    <el-form-item v-if="showCard" label="优惠券:">
      <el-button @click="handleOpenCardDialog(0)">添加优惠券</el-button>
    </el-form-item>
    <el-form-item v-if="showCard">
      <el-form label-position="left" inline class="demo-table-expand" v-for="(item, i) in formData.card" :key="item.id">
        <el-button type="danger" round size="mini" @click="formData.card.splice(i, 1)">删除</el-button>
        <el-form-item label="名称:" style="width:100%"><span class="title" :title="item.title">{{ item.title }}</span></el-form-item>
        <el-form-item label="数量:">每人可领取 {{ item.valuesNum }} 张</el-form-item>
        <el-form-item label="有效期:">领取后 {{ item.fixedTerm }}天过期</el-form-item>
        <el-form-item label="使用条件:" style="width:100%">满 {{ item.leastCost }} 元，立减 {{ item.reduceCost }} 元</el-form-item>
        <el-form-item label="消费特权:" style="width:100%">
          <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.activeDays }} 天，激活 {{ item.activeNums }} 张</template>
          <template v-else>无</template>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 商品券集合 -->
    <el-form-item v-if="showExchange" label="商品券:">
      <el-button @click="handleOpenCardDialog(1)">添加商品券</el-button>
    </el-form-item>
    <el-form-item v-if="showExchange">
      <el-form class="demo-table-expand" label-position="left" inline v-for="(item, i) in formData.exchange" :key="item.id">
        <el-button type="danger" round size="mini" @click="formData.exchange.splice(i, 1)">删除</el-button>
        <el-form-item label="名称:" style="width:100%"><span class="title" :title="item.title">{{ item.title }}</span></el-form-item>
        <el-form-item label="数量:">每人可领取 {{ item.valuesNum }} 张</el-form-item>
        <el-form-item label="有效期:"> 领取后 {{ item.days }}天内有效</el-form-item>
        <el-form-item label="消费特权:" style="width:100%">
          <template v-if="item.isPrivilege == 1">用户每领取后 {{ item.activeDays }} 天，激活 {{ item.activeNums }} 张</template>
          <template v-else>无</template>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 自定义条款 -->
    <el-form-item label="自定义条款1:">
      <el-input v-model="formData.customTerm1" type="textarea" maxlength="200"></el-input>
    </el-form-item>
    <el-form-item label="自定义条款2:">
      <el-input v-model="formData.customTerm2" type="textarea" maxlength="200"></el-input>
    </el-form-item>
    <el-form-item label="自定义条款3:">
      <el-input v-model="formData.customTerm3" type="textarea" maxlength="200"></el-input>
    </el-form-item>
  </el-form>
  <!-- 弹窗 -->
  <el-dialog title="设置券信息" :visible.sync="showDialog" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
    <opencard-template v-if="showDialog" :cardType="tableType" ref="opencardTemplate"></opencard-template>

    <span slot="footer" class="dialog-footer">
      <el-button @click="showDialog=false;tableType='';">取 消</el-button>
      <el-button type="primary" @click="handleSubmitForm">确 定</el-button>
    </span>
  </el-dialog>
</el-container>
</template>
<script>
import { isValidPrice, isValidNumber } from "@/utils/validate";
import { getGiftDetailsById } from '@/api/marketCenter';
import opencardTemplate from "./opencardTemplate";

export default {
  props: ["type"],
  name: "opencardForm",
  components: { opencardTemplate },
  data() {
    const validMoney = (rule, value, callback) => {
      if (parseFloat(value) == 0 || value == "" || !isValidPrice(value)) {
        callback(new Error("请输入合理的金额"));
        return false;
      }
      callback();
    }
    const validNum = (rule, value, callback) => {
      if (value == "" || parseFloat(value) == 0 || !isValidNumber(value)) {
        callback(new Error("请输入非零整数"));
        return false;
      }
      callback();
    }
    return {
      tableType: 0, // 0,优惠券；1，实物券
      showDialog: false,
      showPoint: false,
      showPacket: false,
      showCard: false,
      showExchange: false,
      formData: {
        card: [],
        type: this.type,
        exchange: [],
        redPacket: "",
        point: "",
        fees: "",
        needFees: this.type == 1 ? 1 : 0
      },
      formRules: {
        fees: [
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" }
        ],
        redPacket: [
          { validator: validMoney.bind(this), trigger: "change" },
          { validator: validMoney.bind(this), trigger: "blur" }
        ],
        point: [
          { validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    hanleOnCheckboxChange(type) {
      if (type == 1 && !this.showPoint) {
        this.formData.point = '';
      }
      if (type == 2 && !this.showPacket) {
        this.formData.redPacket = '';
      }
      if (type == 3 && !this.showCard) {
        this.formData.card = [];
      }
      if (type == 4 && !this.showExchange) {
        this.formData.exchange = [];
      }
    },
    handleOpenCardDialog(type) {
      this.tableType = type;
      this.showDialog = true;
    },
    handleSubmitForm() {
      let $el = this.$refs["opencardTemplate"];
      $el.$refs["validateForm"].validate(valid => {
        if (valid) {
          // 处理智慧商盟组件接口id、cardId冲突
          $el.data.id = $el.data.cardId;
          if (this.tableType == 0) {
            this.formData.card.push($el.data);
          } else {
            this.formData.exchange.push($el.data);
          }
          this.showDialog = false;
        }
      })
    }
  }
}
</script>
<style scoped>
.el-form .el-input {
  width:90%!important;
}
.el-form .el-textarea {
  width:90%!important;
}
.demo-table-expand {
  width: 90%;
  font-size: 0;
  border: 1px dashed #DCDFE6;
  padding: 5px 10px;
  margin-bottom: 10px;
  position: relative
}
.demo-table-expand .el-button {
  position: absolute;
  right: 5px;
  top: 5px;
  padding: 5px 10px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 10px;
  width: 50%;
}
.demo-table-expand .el-form-item .title {
  width: 450px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight:bold;
  float:left;
}
.demo-table-expand .el-form-item .el-input {
  width:75px!important;
}
</style>