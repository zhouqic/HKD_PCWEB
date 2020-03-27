<template>
<el-table :data="tableData" style="margin-bottom: 15px;" @row-click="handleOnSelectData">
  <el-table-column align="center" width="40">
    <template slot-scope="scope">
      <el-checkbox v-model="scope.row.checked" :value="scope.row.id == id ? true : false" @change="handleOnSelectData(scope.row)"></el-checkbox>
    </template>
  </el-table-column>

  <el-table-column label="名称" prop="title"></el-table-column>

  <el-table-column label="面额">
    <template slot-scope="scope">
      {{ scope.row.reduceCost + ' 元' }}
    </template>
  </el-table-column>

  <el-table-column label="使用条件">
    <template slot-scope="scope">
      {{ '满 ' + scope.row.leastCost + ' 元，可以使用' }}
    </template>
  </el-table-column>

  <el-table-column label="有效期">
    <template slot-scope="scope">
      {{ '领取后 ' + scope.row.fixedTerm + ' 天内有效' }}
    </template>
  </el-table-column>
</el-table>
</template>
<script>
import { getRfCardsByCreaterId } from "@/api/marketCenter"

export default {
  data() {
    return {
      id: '',
      tableData: []
    }
  },
  created() {
    getRfCardsByCreaterId({}).then(res => {
      this.tableData = res.tableData.filter(item => item.type != 1);
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