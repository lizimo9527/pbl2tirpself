"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      postTitle: "",
      postContent: ""
    };
  },
  methods: {
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/publish/publish.vue:56", "选择的图片:", res.tempFilePaths);
        }
      });
    },
    publishPost() {
      if (!this.postTitle.trim()) {
        common_vendor.index.showToast({
          title: "请输入帖子标题",
          icon: "none"
        });
        return;
      }
      if (!this.postContent.trim()) {
        common_vendor.index.showToast({
          title: "请输入帖子内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "发布中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }, 2e3);
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.postTitle,
    b: common_vendor.o(($event) => $data.postTitle = $event.detail.value),
    c: $data.postContent,
    d: common_vendor.o(($event) => $data.postContent = $event.detail.value),
    e: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    f: common_vendor.o((...args) => $options.publishPost && $options.publishPost(...args)),
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/publish/publish.js.map
