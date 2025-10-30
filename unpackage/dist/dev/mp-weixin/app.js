"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/user/user.js";
  "./pages/map/map.js";
  "./pages/create/create.js";
  "./pages/community/community.js";
  "./pages/match/match.js";
  "./pages/publish/publish.js";
  "./pages/search/search.js";
  "./pages/guide/guide.js";
  "./pages/guide/detail/detail.js";
  "./pages/guide/guide-enhanced.js";
  "./pages/templates/templates.js";
  "./pages/my-plans/my-plans.js";
  "./pages/plan/edit/edit.js";
  "./pages/guide/edit/edit.js";
  "./pages/database/database.js";
  "./pages/test/test.js";
  "./pages/template-detail/template-detail.js";
  "./pages/ai-chat/ai-chat.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  },
  onError: function(error) {
    common_vendor.index.__f__("error", "at App.vue:13", "App Error:", error);
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
