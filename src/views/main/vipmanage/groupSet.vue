<template>
<div class="main-content" style="padding: 20px 20px;">
  <el-tabs v-model="activeTab">
    <el-tab-pane label="我的人群库" name="1"></el-tab-pane>
    <el-tab-pane label="群发记录" name="2" v-if="$store.state.permission.showYingXiao === true"></el-tab-pane>
    <el-tab-pane label="单发记录" name="3" v-if="$store.state.permission.showYingXiao === true"></el-tab-pane>
  </el-tabs>
  <my-group-set v-if="activeTab == 1"></my-group-set>
  <send-records v-if="activeTab == 3"></send-records>
  <group-send-records v-if="activeTab == 2"></group-send-records>
</div>
</template>
<script>
  import myGroupSet from "./components/myGroupSet.vue";
  import sendRecords from "./components/sendRecords.vue";
  import groupSendRecords from "./components/groupSendRecords.vue";

  export default {
    components: { sendRecords, myGroupSet, groupSendRecords },
    data() {
      return {
        activeTab: '1'
      }
    }
  }
</script>