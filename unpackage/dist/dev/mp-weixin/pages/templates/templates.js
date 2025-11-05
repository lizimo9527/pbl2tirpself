"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchText: "",
      currentCategory: "all",
      templatesList: [
        {
          id: 1,
          guideId: "hebei_classic_3days",
          image: "/static/images/templates/hebei1.jpg",
          category: "河北省特色",
          title: "河北经典3日游",
          description: "承德避暑山庄、秦皇岛北戴河、山海关经典路线",
          rating: 4.8,
          usageCount: 156,
          tags: ["3天行程", "经典路线", "历史古迹"]
        },
        {
          id: 2,
          guideId: "hebei_cultural_5days",
          image: "/static/images/templates/baoding.jpg",
          category: "河北省特色",
          title: "河北文化深度5日游",
          description: "保定直隶总督署、正定古城、赵州桥文化之旅",
          rating: 4.7,
          usageCount: 89,
          tags: ["5天行程", "文化深度", "历史探索"]
        },
        {
          id: 3,
          guideId: "hebei_natural_4days",
          image: "/static/images/templates/baishishan.jpg",
          category: "河北省特色",
          title: "河北自然风光4日游",
          description: "野三坡、白石山、苍岩山自然风光探索",
          rating: 4.9,
          usageCount: 123,
          tags: ["4天行程", "自然风光", "户外探险"]
        },
        {
          id: 4,
          guideId: "hebei_greatwall_2days",
          image: "/static/images/templates/qinhuangdao.jpg",
          category: "河北省特色",
          title: "河北长城精华2日游",
          description: "金山岭长城、喜峰口长城长城文化体验",
          rating: 4.6,
          usageCount: 78,
          tags: ["2天行程", "长城文化", "摄影之旅"]
        }
      ]
    };
  },
  computed: {
    filteredTemplates() {
      if (this.currentCategory === "all") {
        return this.templatesList;
      } else if (this.currentCategory === "hebei") {
        return this.templatesList.filter((template) => template.category === "河北省特色");
      } else {
        return this.templatesList.filter((template) => template.category === this.currentCategory);
      }
    }
  },
  methods: {
    onSearchInput(e) {
      this.searchText = e.detail.value;
    },
    searchTemplates() {
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
      }, 1e3);
    },
    filterTemplates(category) {
      this.currentCategory = category;
      common_vendor.index.showToast({
        title: `筛选: ${category}`,
        icon: "none"
      });
    },
    useTemplate(templateId) {
      const template = this.templatesList.find((item) => item.id === templateId);
      if (template) {
        common_vendor.index.navigateTo({
          url: `/pages/template-detail/template-detail?id=${template.guideId}`
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.onSearchInput && $options.onSearchInput(...args)),
    b: $data.searchText,
    c: common_vendor.o((...args) => $options.searchTemplates && $options.searchTemplates(...args)),
    d: $data.currentCategory === "all" ? 1 : "",
    e: common_vendor.o(($event) => $options.filterTemplates("all")),
    f: $data.currentCategory === "hebei" ? 1 : "",
    g: common_vendor.o(($event) => $options.filterTemplates("hebei")),
    h: $data.currentCategory === "domestic" ? 1 : "",
    i: common_vendor.o(($event) => $options.filterTemplates("domestic")),
    j: $data.currentCategory === "overseas" ? 1 : "",
    k: common_vendor.o(($event) => $options.filterTemplates("overseas")),
    l: $data.currentCategory === "self-driving" ? 1 : "",
    m: common_vendor.o(($event) => $options.filterTemplates("self-driving")),
    n: $data.currentCategory === "backpacking" ? 1 : "",
    o: common_vendor.o(($event) => $options.filterTemplates("backpacking")),
    p: $data.currentCategory === "food" ? 1 : "",
    q: common_vendor.o(($event) => $options.filterTemplates("food")),
    r: common_vendor.f($options.filteredTemplates, (template, k0, i0) => {
      return {
        a: template.image,
        b: common_vendor.t(template.category),
        c: common_vendor.t(template.title),
        d: common_vendor.t(template.description),
        e: common_vendor.t(template.rating),
        f: common_vendor.t(template.usageCount),
        g: common_vendor.f(template.tags, (tag, k1, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tag
          };
        }),
        h: template.id,
        i: common_vendor.o(($event) => $options.useTemplate(template.id), template.id)
      };
    }),
    s: $data.templatesList.length === 0
  }, $data.templatesList.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/templates/templates.js.map
