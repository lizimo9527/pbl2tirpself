"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
    },
    // 特色功能方法
    showRoutePlanning() {
      common_vendor.index.showToast({
        title: "智能路线规划功能开发中",
        icon: "none"
      });
    },
    showBudgetManagement() {
      common_vendor.index.showToast({
        title: "预算管理功能开发中",
        icon: "none"
      });
    },
    showTimeArrangement() {
      common_vendor.index.showToast({
        title: "时间安排功能开发中",
        icon: "none"
      });
    },
    showMultiDeviceSync() {
      common_vendor.index.showToast({
        title: "多端同步功能开发中",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0,
    b: common_vendor.o((...args) => $options.startPlanning && $options.startPlanning(...args)),
    c: common_vendor.o((...args) => $options.showRoutePlanning && $options.showRoutePlanning(...args)),
    d: common_vendor.o((...args) => $options.showBudgetManagement && $options.showBudgetManagement(...args)),
    e: common_vendor.o((...args) => $options.showTimeArrangement && $options.showTimeArrangement(...args)),
    f: common_vendor.o((...args) => $options.showMultiDeviceSync && $options.showMultiDeviceSync(...args)),
    g: common_assets._imports_1,
    h: common_vendor.o((...args) => $options.startPlanning && $options.startPlanning(...args)),
    i: common_assets._imports_2,
    j: common_vendor.o((...args) => $options.viewMyPlans && $options.viewMyPlans(...args)),
    k: common_assets._imports_3,
    l: common_vendor.o((...args) => $options.viewTemplates && $options.viewTemplates(...args)),
    m: common_assets._imports_4,
    n: common_vendor.o((...args) => $options.startAIChat && $options.startAIChat(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
