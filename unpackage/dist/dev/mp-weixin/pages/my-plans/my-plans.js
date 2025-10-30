"use strict";
const common_vendor = require("../../common/vendor.js");
const services_guideService = require("../../services/guideService.js");
const _sfc_main = {
  data() {
    return {
      currentFilter: "all",
      plansList: []
    };
  },
  methods: {
    // 加载攻略数据
    loadPlans() {
      const allGuides = services_guideService.guideService.getGuides();
      const userGuides = allGuides.filter((guide) => !guide.isTemplate);
      this.plansList = userGuides.map((guide) => ({
        id: guide.id,
        title: guide.title,
        destination: guide.destination,
        createTime: guide.publishTime ? new Date(guide.publishTime).toLocaleDateString() : new Date(guide.createTime).toLocaleDateString(),
        status: guide.status || "draft",
        statusText: guide.status === "published" ? "已发布" : "草稿",
        views: guide.views || 0,
        likes: guide.likes || 0,
        comments: guide.comments || 0
      }));
    },
    filterPlans(filter) {
      this.currentFilter = filter;
      const allGuides = services_guideService.guideService.getGuides();
      const userGuides = allGuides.filter((guide) => !guide.isTemplate);
      if (filter === "all") {
        this.plansList = userGuides.map((guide) => this.formatGuideData(guide));
      } else if (filter === "published") {
        this.plansList = userGuides.filter((guide) => guide.status === "published").map((guide) => this.formatGuideData(guide));
      } else if (filter === "draft") {
        this.plansList = userGuides.filter((guide) => guide.status === "draft").map((guide) => this.formatGuideData(guide));
      } else if (filter === "favorite") {
        this.plansList = userGuides.map((guide) => this.formatGuideData(guide));
      }
    },
    formatGuideData(guide) {
      return {
        id: guide.id,
        title: guide.title,
        destination: guide.destination,
        createTime: guide.publishTime ? new Date(guide.publishTime).toLocaleDateString() : new Date(guide.createTime).toLocaleDateString(),
        status: guide.status || "draft",
        statusText: guide.status === "published" ? "已发布" : "草稿",
        views: guide.views || 0,
        likes: guide.likes || 0,
        comments: guide.comments || 0
      };
    },
    viewPlanDetail(planId) {
      common_vendor.index.navigateTo({
        url: `/pages/guide/detail/detail?id=${planId}`
      });
    },
    editPlan(planId) {
      common_vendor.index.navigateTo({
        url: `/pages/create/create?id=${planId}&mode=edit`
      });
    },
    deletePlan(planId) {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个攻略吗？此操作不可撤销。",
        success: (res) => {
          if (res.confirm) {
            const success = services_guideService.guideService.deleteGuide(planId);
            if (success) {
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              this.loadPlans();
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
    sharePlan(planId) {
      common_vendor.index.showToast({
        title: "分享功能开发中",
        icon: "none"
      });
    },
    createNewPlan() {
      common_vendor.index.navigateTo({
        url: "/pages/create/create"
      });
    }
  },
  onLoad() {
    this.loadPlans();
  },
  onShow() {
    this.loadPlans();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentFilter === "all" ? 1 : "",
    b: common_vendor.o(($event) => $options.filterPlans("all")),
    c: $data.currentFilter === "published" ? 1 : "",
    d: common_vendor.o(($event) => $options.filterPlans("published")),
    e: $data.currentFilter === "draft" ? 1 : "",
    f: common_vendor.o(($event) => $options.filterPlans("draft")),
    g: $data.currentFilter === "favorite" ? 1 : "",
    h: common_vendor.o(($event) => $options.filterPlans("favorite")),
    i: common_vendor.f($data.plansList, (plan, k0, i0) => {
      return {
        a: common_vendor.t(plan.title),
        b: common_vendor.t(plan.statusText),
        c: common_vendor.n(plan.status),
        d: common_vendor.t(plan.destination),
        e: common_vendor.t(plan.createTime),
        f: common_vendor.t(plan.views),
        g: common_vendor.t(plan.likes),
        h: common_vendor.t(plan.comments),
        i: common_vendor.o(($event) => $options.editPlan(plan.id), plan.id),
        j: common_vendor.o(($event) => $options.deletePlan(plan.id), plan.id),
        k: common_vendor.o(($event) => $options.sharePlan(plan.id), plan.id),
        l: plan.id,
        m: common_vendor.o(($event) => $options.viewPlanDetail(plan.id), plan.id)
      };
    }),
    j: $data.plansList.length === 0
  }, $data.plansList.length === 0 ? {
    k: common_vendor.o((...args) => $options.createNewPlan && $options.createNewPlan(...args))
  } : {}, {
    l: common_vendor.o((...args) => $options.createNewPlan && $options.createNewPlan(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my-plans/my-plans.js.map
