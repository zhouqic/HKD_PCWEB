<template>
<el-table :data="tableData" style="margin-bottom: 15px;" @row-click="handleOnSelectData">
  <el-table-column align="center" width="40">
    <template slot-scope="scope">
      <el-checkbox v-model="scope.row.checked" :value="scope.row.id == id ? true : false" @change="handleOnSelectData(scope.row)"></el-checkbox>
    </template>
  </el-table-column>

  <el-table-column label="名称" prop="title"></el-table-column>
  
  <el-table-column label="图片">
    <template slot-scope="scope">
      <img v-if="scope.row.pic" :src="scope.row.pic" width="50" height="50">
    </template>
  </el-table-column>

  <el-table-column label="价值">
    <template slot-scope="scope">
      {{ scope.row.price + ' 元' }}
    </template>
  </el-table-column>

  <el-table-column label="有效期">
    <template slot-scope="scope">
      {{ '领取后 ' + scope.row.validDays + ' 天过期' }}
    </template>
  </el-table-column>
</el-table>
</template>
<script>
import { findEntityCardList } from "@/api/marketCenter"

export default {
  data() {
    return {
      id: '',
      tableData: []
    }
  },
  created() {
    findEntityCardList({}).then(res => {
      this.tableData = res.tableData;
    })
  },
  methods: {
    handleOnSelectData(row, event, column) {
      if (this.id != row.id) {
        this.tableData.map(item => item.checked = false );
        row.checked = true;
        this.id = row.id;
      } else {
        row.checked = false;
        this.id = '';
      }
      this.$forceUpdate();
    }
  }
}
</script>