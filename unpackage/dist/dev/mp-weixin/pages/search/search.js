"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchText: ""
    };
  },
  methods: {
    handleSearch() {
      if (!this.searchText.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "搜索中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "搜索完成",
          icon: "success"
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.searchText,
    b: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
