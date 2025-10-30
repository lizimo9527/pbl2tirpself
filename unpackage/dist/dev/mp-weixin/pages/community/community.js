"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      searchText: "",
      hotCategories: [
        { id: 1, name: "饮食", icon: "🍽️", count: 312 },
        { id: 2, name: "交通", icon: "🚗", count: 156 },
        { id: 3, name: "住宿", icon: "🏨", count: 234 },
        { id: 4, name: "景点", icon: "🏞️", count: 189 }
      ],
      travelStyles: [
        { id: 1, name: "特种兵式", icon: "⚡", desc: "高效打卡" },
        { id: 2, name: "拍照打卡式", icon: "📸", desc: "记录美好" },
        { id: 3, name: "细品慢游式", icon: "🌿", desc: "深度体验" }
      ],
      latestPosts: [
        {
          id: 1,
          authorAvatar: "/static/images/default-avatar.png",
          authorName: "旅行达人",
          createTime: "2小时前",
          title: "云南大理深度游攻略",
          content: "分享我在大理7天的深度游玩体验，包括小众景点和美食推荐...",
          likes: 45,
          comments: 23,
          tag: "国内游"
        },
        {
          id: 2,
          authorAvatar: "/static/images/default-avatar.png",
          authorName: "摄影爱好者",
          createTime: "5小时前",
          title: "日本京都红叶季摄影指南",
          content: "京都红叶季最佳拍摄地点和时间安排，附详细路线规划...",
          likes: 78,
          comments: 34,
          tag: "出境游"
        },
        {
          id: 3,
          authorAvatar: "/static/images/default-avatar.png",
          authorName: "自驾游玩家",
          createTime: "1天前",
          title: "川西环线自驾游全攻略",
          content: "成都出发，7天川西小环线自驾游路线，包含住宿和美食推荐...",
          likes: 112,
          comments: 56,
          tag: "自驾游"
        }
      ]
    };
  },
  methods: {
    onSearchInput(e) {
      this.searchText = e.detail.value;
    },
    searchPosts() {
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
    viewCategory(category) {
      common_vendor.index.showToast({
        title: `查看分类: ${category}`,
        icon: "none"
      });
    },
    selectTravelStyle(style) {
      common_vendor.index.showToast({
        title: `选择旅行风格: ${style}`,
        icon: "none"
      });
    },
    viewAllPosts() {
      common_vendor.index.showToast({
        title: "查看全部帖子",
        icon: "none"
      });
    },
    viewPostDetail(postId) {
      common_vendor.index.showToast({
        title: `查看帖子详情: ${postId}`,
        icon: "none"
      });
    },
    createPost() {
      common_vendor.index.navigateTo({
        url: "/pages/publish/publish"
      });
    }
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/community/community.vue:196", "社区页面显示");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.onSearchInput && $options.onSearchInput(...args)),
    b: $data.searchText,
    c: common_vendor.o((...args) => $options.searchPosts && $options.searchPosts(...args)),
    d: common_vendor.f($data.hotCategories, (category, k0, i0) => {
      return {
        a: common_vendor.t(category.icon),
        b: common_vendor.t(category.name),
        c: common_vendor.t(category.count),
        d: category.id,
        e: common_vendor.o(($event) => $options.viewCategory(category.name), category.id)
      };
    }),
    e: common_vendor.f($data.travelStyles, (style, k0, i0) => {
      return {
        a: common_vendor.t(style.icon),
        b: common_vendor.t(style.name),
        c: common_vendor.t(style.desc),
        d: style.id,
        e: common_vendor.o(($event) => $options.selectTravelStyle(style.name), style.id)
      };
    }),
    f: common_vendor.o((...args) => $options.viewAllPosts && $options.viewAllPosts(...args)),
    g: common_vendor.f($data.latestPosts, (post, k0, i0) => {
      return {
        a: post.authorAvatar,
        b: common_vendor.t(post.authorName),
        c: common_vendor.t(post.createTime),
        d: common_vendor.t(post.title),
        e: common_vendor.t(post.content),
        f: common_vendor.t(post.likes),
        g: common_vendor.t(post.comments),
        h: common_vendor.t(post.tag),
        i: post.id,
        j: common_vendor.o(($event) => $options.viewPostDetail(post.id), post.id)
      };
    }),
    h: common_vendor.o((...args) => $options.createPost && $options.createPost(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/community.js.map
