"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        name: "旅行爱好者",
        level: "Lv.5 资深玩家",
        desc: "热爱旅行，喜欢探索未知的世界",
        stats: {
          plans: 12,
          followers: 156,
          following: 89,
          likes: 234
        }
      }
    };
  },
  methods: {
    viewMyPlans() {
      common_vendor.index.navigateTo({
        url: "/pages/my-plans/my-plans"
      });
    },
    viewMyMatches() {
      common_vendor.index.showToast({
        title: "查看我的搭子",
        icon: "none"
      });
    },
    viewMyPosts() {
      common_vendor.index.showToast({
        title: "查看我的帖子",
        icon: "none"
      });
    },
    viewMyFavorites() {
      common_vendor.index.showToast({
        title: "查看我的收藏",
        icon: "none"
      });
    },
    // 热门分类方法
    viewFoodCategory() {
      common_vendor.index.showToast({
        title: "查看饮食分类",
        icon: "none"
      });
    },
    viewTransportCategory() {
      common_vendor.index.showToast({
        title: "查看交通分类",
        icon: "none"
      });
    },
    viewAccommodationCategory() {
      common_vendor.index.showToast({
        title: "查看住宿分类",
        icon: "none"
      });
    },
    viewAttractionsCategory() {
      common_vendor.index.showToast({
        title: "查看景点分类",
        icon: "none"
      });
    },
    // 旅行风格方法
    selectSpecialForcesStyle() {
      common_vendor.index.showToast({
        title: "选择特种兵式旅行风格",
        icon: "none"
      });
    },
    selectPhotoStyle() {
      common_vendor.index.showToast({
        title: "选择拍照打卡式旅行风格",
        icon: "none"
      });
    },
    selectSlowTravelStyle() {
      common_vendor.index.showToast({
        title: "选择细品慢游式旅行风格",
        icon: "none"
      });
    },
    editProfile() {
      common_vendor.index.showToast({
        title: "编辑资料",
        icon: "none"
      });
    },
    accountSettings() {
      common_vendor.index.showToast({
        title: "账号设置",
        icon: "none"
      });
    },
    notificationSettings() {
      common_vendor.index.showToast({
        title: "通知设置",
        icon: "none"
      });
    },
    privacySettings() {
      common_vendor.index.showToast({
        title: "隐私设置",
        icon: "none"
      });
    },
    helpCenter() {
      common_vendor.index.showToast({
        title: "帮助中心",
        icon: "none"
      });
    },
    aboutApp() {
      common_vendor.index.showModal({
        title: "关于TripSelf",
        content: `TripSelf - 旅行自助服务平台

版本: 1.0.0

打造您的专属旅行体验`,
        showCancel: false
      });
    },
    logout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({
              title: "退出中..."
            });
            setTimeout(() => {
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({
                title: "退出成功",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.switchTab({
                  url: "/pages/index/index"
                });
              }, 1500);
            }, 1e3);
          }
        }
      });
    }
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/user/user.vue:323", "个人中心页面显示");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.t($data.userInfo.name),
    c: common_vendor.t($data.userInfo.level),
    d: common_vendor.t($data.userInfo.desc),
    e: common_vendor.t($data.userInfo.stats.plans),
    f: common_vendor.t($data.userInfo.stats.followers),
    g: common_vendor.t($data.userInfo.stats.following),
    h: common_vendor.t($data.userInfo.stats.likes),
    i: common_vendor.o((...args) => $options.viewMyPlans && $options.viewMyPlans(...args)),
    j: common_vendor.o((...args) => $options.viewMyMatches && $options.viewMyMatches(...args)),
    k: common_vendor.o((...args) => $options.viewMyPosts && $options.viewMyPosts(...args)),
    l: common_vendor.o((...args) => $options.viewMyFavorites && $options.viewMyFavorites(...args)),
    m: common_vendor.o((...args) => $options.viewFoodCategory && $options.viewFoodCategory(...args)),
    n: common_vendor.o((...args) => $options.viewTransportCategory && $options.viewTransportCategory(...args)),
    o: common_vendor.o((...args) => $options.viewAccommodationCategory && $options.viewAccommodationCategory(...args)),
    p: common_vendor.o((...args) => $options.viewAttractionsCategory && $options.viewAttractionsCategory(...args)),
    q: common_vendor.o((...args) => $options.selectSpecialForcesStyle && $options.selectSpecialForcesStyle(...args)),
    r: common_vendor.o((...args) => $options.selectPhotoStyle && $options.selectPhotoStyle(...args)),
    s: common_vendor.o((...args) => $options.selectSlowTravelStyle && $options.selectSlowTravelStyle(...args)),
    t: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args)),
    v: common_vendor.o((...args) => $options.accountSettings && $options.accountSettings(...args)),
    w: common_vendor.o((...args) => $options.notificationSettings && $options.notificationSettings(...args)),
    x: common_vendor.o((...args) => $options.privacySettings && $options.privacySettings(...args)),
    y: common_vendor.o((...args) => $options.helpCenter && $options.helpCenter(...args)),
    z: common_vendor.o((...args) => $options.aboutApp && $options.aboutApp(...args)),
    A: common_vendor.o((...args) => $options.logout && $options.logout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
