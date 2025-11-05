"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      // 精简后的数据，专注于攻略制作
    };
  },
  methods: {
    startPlanning() {
      common_vendor.index.switchTab({
        url: "/pages/create/create"
      });
    },
    viewMyPlans() {
      common_vendor.index.navigateTo({
        url: "/pages/my-plans/my-plans"
      });
    },
    viewTemplates() {
      common_vendor.index.navigateTo({
        url: "/pages/templates/templates"
      });
    },
    startAIChat() {
      common_vendor.index.navigateTo({
        url: "/pages/ai-chat/ai-chat"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.startPlanning && $options.startPlanning(...args)),
    b: common_vendor.o((...args) => $options.startPlanning && $options.startPlanning(...args)),
    c: common_vendor.o((...args) => $options.viewMyPlans && $options.viewMyPlans(...args)),
    d: common_vendor.o((...args) => $options.viewTemplates && $options.viewTemplates(...args)),
    e: common_vendor.o((...args) => $options.startAIChat && $options.startAIChat(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
