<template>
  <div class="pane-group" :style="{width:width, height:height}">
    <div class="pane-title">
      {{ title }}
      <div class="pull-right">
        <slot name="tools"></slot>
      </div>
    </div>
    <div class="pane-content">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "panelGrop",
  props: ["title", "width", "height"]
}
</script>
<style lang="scss" scoped>
.pane-group {
  width: 100%;
  height: 330px;
  .pane-title {
    border-bottom: 1px solid #e7eaec;
    background-color: #fff;
    padding: 14px 15px 7px;
    min-height: 48px;
    font-size: 14px;
    line-height: 32px;
    font-weight: bold;
  }
}
</style>