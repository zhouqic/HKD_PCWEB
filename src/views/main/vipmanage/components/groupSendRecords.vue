<template>
  <div>
    <!-- 新建 -->
    <el-form label-width="90px">
      <el-form-item class="inline-block" label="营销类型：">
        <el-select v-model="type" placeholder="">
          <el-option value="sms" label="短信营销"></el-option>
          <el-option value="card" label="券营销"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label="人群名称：">
        <el-select v-model="typeId">
          <el-option value="" label="不限"></el-option>
          <el-option v-for="item in tableData" :key="item.typeId" :value="item.typeId" :label="item.consumName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="inline-block" label-width="0px">
        <el-button type="primary" @click="handleSubmitForm()">查询</el-button>
        <el-button type="primary" @click="handleResetFormData()">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <card-page v-if="this.tableType == 'card'" ref="cardPage" :data="data"></card-page>
    <sms-page v-if="this.tableType == 'sms'" ref="cardPage" :data="data"></sms-page>
  </div>
</template>

<script>
import { getMemberCondition } from '@/api/vipManage';
import cardPage from './cardPage';
import smsPage from './smsPage';
export default {
  name: "groupSendRecords",
  components: { cardPage, smsPage },
  data() {
    return {
      tableType: 'card',
      type: 'card',
      typeId: '',
      tableData: [],
      data: {}
    }
  },
  created() {
    getMemberCondition().then(res => {
      this.tableData = res.tableData;
    })
  },
  methods: {
    handleResetFormData() {
      this.typeId = '';
      this.type = 'card';
    },
    handleSubmitForm() {
      this.data.name = this.typeId;
      this.$refs["cardPage"].handleSubmitForm(() => {
        this.tableType = this.type;
      });
    }
  }
};
</script>