<template>
  <el-date-picker
    v-model="time"
    :type="type"
    unlink-panels
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :clearable="false"
    value-format="yyyy-MM-dd"
    @change="handleSelectDate"
    style="width: 260px"
  ></el-date-picker>
</template>
<script>
export default {
  name: "DatePicker",
  props: ["value", "type"],
  data() {
    return {
      time: this.value
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        if (oldVal != newVal) {
          this.time = newVal;
        }
      },
      deep: true
    }
  },
  methods: {
    handleSelectDate() {
      this.$emit("update:value", this.time)
      this.$emit("focus", this.time)
    }
  }
};
</script>