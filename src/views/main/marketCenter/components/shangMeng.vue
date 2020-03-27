<template>
<div class="main-content" style="padding: 20px 20px;">
  <el-tabs v-model="activeTab">
    <el-tab-pane label="商盟活动" name="0"></el-tab-pane>
    <el-tab-pane label="我的活动" name="1"></el-tab-pane>
  </el-tabs>
  <shangmeng-list v-if="activeTab === '0'"></shangmeng-list>
  <shangmeng-joined v-if="activeTab === '1'"></shangmeng-joined>
</div>
</template>
<script>
  import shangmengList from "./shangmengList";
  import shangmengJoined from "./shangmengJoined";

  export default {
    components: { shangmengList, shangmengJoined },
    data() {
      return {
        activeTab: "0",
      }
    }
  }
</script>