<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar class="sidebar-container"></sidebar>
    <navbar></navbar>
    <tags-view></tags-view>
    <div class="main-container">
      <section class="app-main">
        <transition name="fade" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view></router-view>
          </keep-alive>
        </transition>
      </section>
    </div>
    <!-- 图片裁剪工具 -->
    <img-cropper v-if="showCrop" :data="data" @close="emit"></img-cropper>
  </div>
</template>

<script>
  import { Navbar, Sidebar, TagsView } from './common/navigation';
  import ImgCropper from '@/components/ImgCropper';

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      TagsView,
      ImgCropper
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      }
    },
    data() {
      return {
        showCrop: false,
        data: {
          type: '',
          url: ''
        }
      }
    },
    methods: {
      emit(type, data) {
        this.showCrop = false;
        if (type) {
          this.$bus.emit("set-file", data);
        }
      }
    },
    created() {
      this.$bus.on('send-file', data => {
        this.data.type = data.file.type;
        this.data.name = data.file.name;
        this.data.ratio = data.ratio;
        const _this = this;
        const reader = new FileReader();
        reader.readAsDataURL(data.file);
        reader.onload = function (e) {
          _this.data.url = this.result;
          _this.showCrop = true;
        }
      });
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    background: #f0f2f5;
    overflow: hidden;
    .app-main {
      padding: 20px;
      height: 100%;
    }
  }
</style>
