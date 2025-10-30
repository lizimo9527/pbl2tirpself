"use strict";
const common_vendor = require("../../common/vendor.js");
const services_guideService = require("../../services/guideService.js");
const _sfc_main = {
  data() {
    return {
      guides: [],
      searchKeyword: "",
      filteredGuides: []
    };
  },
  methods: {
    // 加载攻略列表
    loadGuides() {
      this.guides = services_guideService.guideService.getUserGuides();
      this.filterGuides();
    },
    // 搜索输入处理
    onSearchInput(e) {
      this.searchKeyword = e.detail.value;
      this.filterGuides();
    },
    // 过滤攻略
    filterGuides() {
      if (this.searchKeyword) {
        this.filteredGuides = services_guideService.guideService.searchGuides(this.searchKeyword);
      } else {
        this.filteredGuides = [...this.guides];
      }
    },
    // 创建新攻略
    createGuide() {
      common_vendor.index.navigateTo({
        url: "/pages/create/create"
      });
    },
    // 查看攻略详情
    viewGuideDetail(guideId) {
      common_vendor.index.navigateTo({
        url: `/pages/guide/detail/detail?id=${guideId}`
      });
    },
    // 编辑攻略
    editGuide(guideId) {
      common_vendor.index.navigateTo({
        url: `/pages/create/create?id=${guideId}&mode=edit`
      });
    },
    // 删除攻略
    deleteGuide(guideId) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个攻略吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            const success = services_guideService.guideService.deleteGuide(guideId);
            if (success) {
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              this.loadGuides();
            } else {
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    },
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      if (diff < 6048e5)
        return Math.floor(diff / 864e5) + "天前";
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0");
    }
  },
  onShow() {
    this.loadGuides();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.createGuide && $options.createGuide(...args)),
    b: common_vendor.o((...args) => $options.onSearchInput && $options.onSearchInput(...args)),
    c: $data.searchKeyword,
    d: $data.filteredGuides.length === 0
  }, $data.filteredGuides.length === 0 ? {
    e: common_vendor.t($data.searchKeyword ? "未找到相关攻略" : "暂无攻略"),
    f: common_vendor.t($data.searchKeyword ? "尝试其他关键词" : '点击"新建攻略"开始创建')
  } : {
    g: common_vendor.f($data.filteredGuides, (guide, k0, i0) => {
      return common_vendor.e({
        a: guide.imagePath
      }, guide.imagePath ? {
        b: guide.imagePath
      } : {}, {
        c: common_vendor.t(guide.title),
        d: common_vendor.t(guide.status === "published" ? "已发布" : "草稿"),
        e: common_vendor.n(guide.status),
        f: common_vendor.t(guide.destination || "未设置目的地"),
        g: common_vendor.t($options.formatDate(guide.updateTime || guide.createTime)),
        h: common_vendor.t(guide.content ? guide.content.length + "字" : "0字"),
        i: guide.tags && guide.tags.length > 0
      }, guide.tags && guide.tags.length > 0 ? common_vendor.e({
        j: common_vendor.f(guide.tags.slice(0, 3), (tag, index, i1) => {
          return {
            a: common_vendor.t(tag),
            b: index
          };
        }),
        k: guide.tags.length > 3
      }, guide.tags.length > 3 ? {
        l: common_vendor.t(guide.tags.length - 3)
      } : {}) : {}, {
        m: common_vendor.o(($event) => $options.editGuide(guide.id), guide.id),
        n: common_vendor.o(($event) => $options.deleteGuide(guide.id), guide.id),
        o: guide.id,
        p: common_vendor.o(($event) => $options.viewGuideDetail(guide.id), guide.id)
      });
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guide/guide.js.map
