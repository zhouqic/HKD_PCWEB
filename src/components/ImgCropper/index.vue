<template>
  <div class="img-cropper">
    <div class="img-cropper-wrap">
      <div class="vicp-close" @click="$emit('close', 0)">
        <i class="vicp-icon4"></i>
      </div>
      <div class="canvas" @dblclick="dblclick">
        <img ref="image" :src="data.url" @load="start">
      </div>
      <div class="toolbar" @click="click">
        <button class="toolbar__button" data-action="move" title="移动">
          <span class="fa fa-arrows"></span>
        </button>
        <button class="toolbar__button" data-action="crop" title="裁剪">
          <span class="fa fa-crop"></span>
        </button>
        <button class="toolbar__button" data-action="zoom-in" title="放大">
          <span class="fa fa-search-plus"></span>
        </button>
        <button class="toolbar__button" data-action="zoom-out" title="缩小">
          <span class="fa fa-search-minus"></span>
        </button>
        <button class="toolbar__button" data-action="rotate-left" title="逆时针旋转">
          <span class="fa fa-rotate-left"></span>
        </button>
        <button class="toolbar__button" data-action="rotate-right" title="顺时针旋转">
          <span class="fa fa-rotate-right"></span>
        </button>
        <button class="toolbar__button" data-action="flip-horizontal" title="水平翻转">
          <span class="fa fa-arrows-h"></span>
        </button>
        <button class="toolbar__button" data-action="flip-vertical" title="垂直翻转">
          <span class="fa fa-arrows-v"></span>
        </button>
        <button class="toolbar__button" data-action="confirm" title="确认" v-if="cropping">
          <span class="fa fa-check"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.min.css";
import "./font-awesome.min.css";
import "./index.css";

export default {
  props: ["data"],
  data() {
    return {
      canvasData: null,
      cropBoxData: null,
      croppedData: null,
      cropper: null,
      cropped: false,
      cropping: false,
      loaded: false,
      previousUrl: '',
      url: ''
    };
  },
  watch:{
    data: function(newVal,oldVal){
      this.url = newVal;
    }
  },
  methods: {
    click({ target }) {
      const { cropper } = this;
      const action =
        target.getAttribute("data-action") ||
        target.parentElement.getAttribute("data-action");

      switch (action) {
        case "move":
        case "crop":
          cropper.setDragMode(action);
          break;

        case "zoom-in":
          cropper.zoom(0.1);
          break;

        case "zoom-out":
          cropper.zoom(-0.1);
          break;

        case "rotate-left":
          cropper.rotate(-90);
          break;

        case "rotate-right":
          cropper.rotate(90);
          break;

        case "flip-horizontal":
          cropper.scaleX(-cropper.getData().scaleX || -1);
          break;

        case "flip-vertical":
          cropper.scaleY(-cropper.getData().scaleY || -1);
          break;

        case "confirm":
          this.crop();
          break;

        default:
      }
    },

    keydown(e) {
      const { cropper } = this;

      if (!cropper) {
        return;
      }

      switch (e.key) {
        // Crop the image
        case "Enter":
          this.crop();
          break;

        // Clear crop area
        case "Escape":
          this.clear();
          break;

        // Move to the left
        case "ArrowLeft":
          e.preventDefault();
          cropper.move(-1, 0);
          break;

        // Move to the top
        case "ArrowUp":
          e.preventDefault();
          cropper.move(0, -1);
          break;

        // Move to the right
        case "ArrowRight":
          e.preventDefault();
          cropper.move(1, 0);
          break;

        // Move to the bottom
        case "ArrowDown":
          e.preventDefault();
          cropper.move(0, 1);
          break;

        // Enter crop mode
        case "c":
          cropper.setDragMode("crop");
          break;

        // Enter move mode
        case "m":
          cropper.setDragMode("move");
          break;

        // Zoom in
        case "i":
          cropper.zoom(0.1);
          break;

        // Zoom out
        case "o":
          cropper.zoom(-0.1);
          break;

        // Rotate left
        case "l":
          cropper.rotate(-90);
          break;

        // Rotate right
        case "r":
          cropper.rotate(90);
          break;

        // Flip horizontal
        case "h":
          cropper.scaleX(-cropper.getData().scaleX || -1);
          break;

        // Flip vertical
        case "v":
          cropper.scaleY(-cropper.getData().scaleY || -1);
          break;

        default:
      }
    },

    dblclick(e) {
      if (e.target.className.indexOf("cropper-face") >= 0) {
        e.preventDefault();
        e.stopPropagation();
        this.crop();
      }
    },

    start() {
      if (this.cropped) {
        return;
      }

      this.cropper = new Cropper(this.$refs.image, {
        aspectRatio: this.data.ratio ? this.data.ratio : NaN,
        autoCrop: false,
        dragMode: "move",
        background: true,
        ready: () => {
          if (this.croppedData) {
            this.cropper
              .crop()
              .setData(this.croppedData)
              .setCanvasData(this.canvasData)
              .setCropBoxData(this.cropBoxData);
            this.croppedData = null;
            this.canvasData = null;
            this.cropBoxData = null;
          }
        },
        crop: ({ detail }) => {
          if (detail.width > 0 && detail.height > 0 && !this.cropping) {
            this.cropping = true;
          }
        }
      });
    },
    dataURLtoFile(dataurl, filename) {//将base64转换为文件
      var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length,
          u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, {type: mime});
    },
    stop(type) {
      if (this.cropper) {
        this.cropper.destroy();
        this.cropper = null;
        this.$emit('close', type, this.dataURLtoFile(this.data.url, this.data.name));
      }
    },

    crop() {
      const { cropper, data } = this;

      if (this.cropping) {
        this.croppedData = cropper.getData();
        this.canvasData = cropper.getCanvasData();
        this.cropBoxData = cropper.getCropBoxData();
        this.cropping = false;
        this.cropped = false;
        this.previousUrl = data;
        const type = data.url.split(";")[0].replace("data:", "");
        this.data.url = cropper.getCroppedCanvas(data.type.match(/image\/png/gi) == null ? {} : { fillColor: "#fff" }).toDataURL(data.type);
        this.stop(1);
      }
    },

    clear() {
      if (this.cropping) {
        this.cropper.clear();
        this.cropping = false;
      }
    },

    update(data) {
      Object.assign(this.data, data);
    }
  },

  mounted() {
    window.addEventListener(
      "keydown",
      (this.onKeydown = this.keydown.bind(this))
    );
  },

  beforeDestroy() {
    window.removeEventListener("keydown", this.onKeydown);
    this.stop(1);
  }
};
</script>