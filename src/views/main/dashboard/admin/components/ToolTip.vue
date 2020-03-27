<template>
  <el-tooltip class="item" :content="content" placement="top">
    <span class="svg-container">
      <svg-icon icon-class="question"/>
    </span>
  </el-tooltip>
</template>
<script>
export default {
  name: 'ToolTip',
  props: ["content"]
}
</script>
