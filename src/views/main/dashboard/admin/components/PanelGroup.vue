<template>
  <el-row class="panel-group" :gutter="40">

    <template v-for="(items, i) in cards">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" :key="i">
        <div class='card-panel'>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ items.title }}</div>
            <div class="card-panel-count"><count-to class="card-panel-num" :startVal="0" :endVal="items.count" :duration="2600"></count-to></div>
          </div>
          <el-row :gutter="20">

            <template v-for="(item, j) in items.jytype">
              <el-col :span="24 / items.jytype.length" :key="j">
                <div class="card-panel-type">{{ item.label }}</div>
                <div class="card-panel-val">{{ item.value }}元</div>
              </el-col>
            </template>

          </el-row>
        </div>
      </el-col>
    </template>
    
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  props: ["cards"],
  components: {
    CountTo
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 170px;
    cursor: pointer;
    font-size: 12px;
    padding: 15px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border: 1px solid rgba(187, 187, 187, 1);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-description {
      font-weight: bold;
      margin-bottom: 25px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 1);
        font-size: 16px;
        margin-bottom: 25px;
      }
      .card-panel-count {
        text-align: center;
      }
      .card-panel-num {
        font-size: 28px;
      }
    }
    .card-panel-type, .card-panel-val {
      text-align: center;
      margin-bottom: 20px;
    }
  }
}
</style>