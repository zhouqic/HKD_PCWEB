<template>
  <el-dialog
    :visible.sync="show"
    width="850px"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-dialog"
  >
    <span slot="title">
      <div class="container">
        <img :src="data.headimgurl ? data.headimgurl : defaultImg" width="50" height="50">
        <div class="content">
          <div class="item">
            <small>会员卡号：{{ data.userCardCode }}</small>
            <small>会员姓名：{{ data.realName ? data.realName : '未设置' }}</small>
          </div>
          <div class="item">
            <big>积分：{{ data.points ? data.points : 0 }}</big>
            <big>优惠券：{{ data.num ? data.num : 0 }} 张</big>
            <big>余额：{{ data.balance ? data.balance : 0 }}</big>
            <big>账户总额：{{ data.totalBalance ? data.totalBalance : 0 }}</big>
          </div>
        </div>
      </div>
    </span>
    <el-tabs v-model="tab">
      <el-tab-pane label="会员信息" name="1"></el-tab-pane>
      <el-tab-pane label="消费记录" name="2"></el-tab-pane>
      <el-tab-pane label="储值记录" name="3"></el-tab-pane>
      <el-tab-pane label="核销记录" name="4"></el-tab-pane>
    </el-tabs>
    <!-- 基本信息 -->
    <el-form v-if="tab == 1" :model="basicData" :rules="rules" ref="userInfoForm">
      <table class="basic-info">
        <tbody>
          <tr>
            <td><el-form-item label="会员昵称：">{{ basicData.name }}</el-form-item></td>
            <td><el-form-item label="激活状态：">{{ basicData.isExcel ? "未激活" : "已激活" }}</el-form-item></td>
            <td><el-form-item label="会员等级：">{{ basicData.labelId }}</el-form-item></td>
          </tr>
          <tr>
            <td>
              <el-form-item label="会员姓名：">
                <template v-if="isEdit">
                  <el-input v-model.trim="basicData.realName" maxlength="10" style="width: 180px"></el-input>
                </template>
                <template v-else>{{ basicData.realName ? data.realName : '未设置' }}</template>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="会员性别：">
                <template v-if="isEdit">
                  <el-select v-model.trim="basicData.sex" style="width: 180px">
                    <el-option value="男" label="男"></el-option>
                    <el-option value="女" label="女"></el-option>
                  </el-select>
                </template>
                <template v-else>{{ basicData.sex }}</template>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="手机号码：" prop="phone">
                <template v-if="isEdit">
                  <el-input v-model.trim="basicData.phone" maxlength="11" style="width: 180px"></el-input>
                </template>
                <template v-else>{{ basicData.phone }}</template>
              </el-form-item>
            </td>
          </tr>
        <tr>
            <td><el-form-item label="公众账号：">{{ basicData.subscribe1 ? "已关注" : "未关注" }}</el-form-item></td>
            <td><el-form-item label-width="100px" label="会员成长值：">{{ basicData.growValue }}</el-form-item></td>
            <td><el-form-item label="注册时间：">{{ basicData.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item></td>
          </tr>
          <tr>
            <td v-if="isEdit && $parent.formData.flag != 1 && $parent.formData.flag != 4">
              <el-form-item label="会员积分：" prop="points">
                <el-input v-model="basicData.points" maxlength="10" style="width: 180px"></el-input>
              </el-form-item>
            </td>
            <td v-if="isEdit && $parent.formData.flag != 1 && $parent.formData.flag != 4">
              <el-form-item label="会员余额：" prop="balance">
                <el-input v-model="basicData.balance" maxlength="10" style="width: 180px"></el-input>
              </el-form-item>
            </td>
            <td :colspan="!isEdit ? 3 : 1">
              <el-form-item label="详细地址：">
                <template v-if="isEdit">
                  <el-input v-model.trim="basicData.adress" maxlength="40" style="width: 180px"></el-input>
                </template>
                <template v-else><div class="block" :title="basicData.adress">{{ basicData.adress }}</div></template>
              </el-form-item>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <!-- 消费记录 -->
    <xf-record v-else-if="tab == 2" :id="id"></xf-record>
    <!-- 储值记录 -->
    <cz-record v-else-if="tab == 3" :id="id"></cz-record>
    <!-- 核销记录 -->
    <hx-record v-else-if="tab == 4" :id="id"></hx-record>
    <span slot="footer">
      <el-button @click="$emit('closed')">关 闭</el-button>
      <el-button type="primary" v-if="tab == 1" @click="handleOnConfirmClick()" :disabled="isSubmit ? true : false">{{ isEdit ? '保 存' : '编 辑' }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getRfShopUserInfoById, getMemberLabelList, saveRfShopUserInfo } from "@/api/vipManage";
import XfRecord from "./xfRecord";
import CzRecord from "./czRecord";
import HxRecord from "./hxRecord";

export default {
  props: ["show", "id"],
  components: { XfRecord, CzRecord, HxRecord },
  data() {
    const validPhone = (rule, value, callback) => {
      if (this.data.phone === "" && value === "") {
        callback();
        return false;
      }
      const reg = /^1(3|4|5|7|8)\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    }
    const validNum = (rule, value, callback) => {
      const reg = /^([0-9]|[1-9]\d*)(\.\d{1,2})?$/;
      if (!reg.test(value)) {
        callback(new Error("请输入最多两位小数的数字"));
      } else {
        callback();
      }
    }
    return {
      defaultImg: require("@/assets/default_logo.jpg"),
      data: {},
      isSubmit: false,
      basicData: {},
      rules: {
        phone: [{ validator: validPhone.bind(this), trigger: "change" },
          { validator: validPhone.bind(this), trigger: "blur" }
        ],
        balance: [{ validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ],
        points: [{ validator: validNum.bind(this), trigger: "change" },
          { validator: validNum.bind(this), trigger: "blur" }
        ]
      },
      levelList: [],
      isEdit: false,
      tab: '1'
    }
  },
  created() {
    this.handleUserInfo();
  },
  methods: {
    handleUserInfo() {
      getRfShopUserInfoById({ id: this.id }).then(res => {
        this.data = res.tableData;
        this.basicData ={...this.data};
        this.$forceUpdate();
      })
    },
    handleOnConfirmClick() {
      if(!this.isEdit) {
        this.isEdit = true;
        this.handleGetLabelList();
      } else {
        this.$refs["userInfoForm"].validate(valid => {
          if (valid) {
            let params = {
              staffId: this.$store.getters.staffId,
              adress: this.basicData.adress,
              balance: this.basicData.balance,
              id: this.basicData.id,
              realName: this.basicData.realName,
              phone: this.basicData.phone,
              points: this.basicData.points,
              sex: this.basicData.sex,
            };
            this.isSubmit = true;
            saveRfShopUserInfo(params).then(res => {
              this.$message({ type: "success", message: "保存成功" });
              this.handleUserInfo();
              this.isEdit = false;
              this.isSubmit = false;
            }).catch(() => { this.isSubmit = false });
          }
        })
      }
    },
    handleGetLabelList() {
      getMemberLabelList().then(res => {
        this.levelList = [];
        res.tableData.forEach(item => {
          this.levelList.push({id: item.id, name: item.content})
        })
      })
    }
  },
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item .el-form-item__label{
  height: 40px;
  line-height: 40px;
  font-weight: 400;
}
.edit-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
  .el-dialog__header .container {
    color: #fff;
    overflow: hidden;
    img {
      float: left;
      border-radius: 50%;
    }
    .content {
      float: left;
      margin-left: 20px;
      .item:nth-child(1) {
        margin-top: 3px;
        margin-bottom: 10px;
      }
      .item small {
        font-size: 14px;
        margin-right: 50px;
      }
      .item big {
        font-size: 16px;
        margin-right: 30px;
      }
    }
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
  .basic-info {
    width: 100%;
    td {
      // padding: 12px 0;
      // line-height: 32px;
      div.block {
        max-width: 700px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
      }
     /deep/ .el-select .el-input {
        width: 100%;
      }
    }
  }
}
</style>