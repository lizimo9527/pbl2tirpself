"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      destinationOptions: ["全部目的地", "国内游", "出境游", "东南亚", "欧洲", "北美"],
      destinationIndex: 0,
      dateOptions: ["全部时间", "近期出行", "本月", "下个月", "半年内"],
      dateIndex: 0,
      recommendedPartners: [
        {
          id: 1,
          avatar: "/static/images/default-avatar.png",
          name: "旅行达人小王",
          tags: ["摄影", "美食", "文化"],
          matchRate: 85,
          destination: "云南大理",
          travelDate: "2024-12-15",
          travelStyle: "深度游"
        },
        {
          id: 2,
          avatar: "/static/images/default-avatar.png",
          name: "背包客小李",
          tags: ["徒步", "露营", "探险"],
          matchRate: 92,
          destination: "川西环线",
          travelDate: "2024-11-20",
          travelStyle: "自驾游"
        },
        {
          id: 3,
          avatar: "/static/images/default-avatar.png",
          name: "美食爱好者小张",
          tags: ["美食探店", "城市漫步", "休闲"],
          matchRate: 78,
          destination: "成都重庆",
          travelDate: "2024-12-01",
          travelStyle: "美食之旅"
        }
      ],
      myMatches: [
        {
          id: 1,
          avatar: "/static/images/default-avatar.png",
          name: "摄影达人",
          status: "已匹配",
          lastContact: "2小时前"
        },
        {
          id: 2,
          avatar: "/static/images/default-avatar.png",
          name: "自驾游伙伴",
          status: "等待回复",
          lastContact: "1天前"
        }
      ]
    };
  },
  methods: {
    onDestinationChange(e) {
      this.destinationIndex = e.detail.value;
    },
    onDateChange(e) {
      this.dateIndex = e.detail.value;
    },
    searchPartners() {
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
    },
    viewPartnerDetail(partnerId) {
      common_vendor.index.showToast({
        title: `查看搭子详情: ${partnerId}`,
        icon: "none"
      });
    },
    contactPartner(partnerId) {
      common_vendor.index.showModal({
        title: "联系搭子",
        content: "确定要联系这位搭子吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "联系请求已发送",
              icon: "success"
            });
          }
        }
      });
    },
    likePartner(partnerId) {
      common_vendor.index.showToast({
        title: "已添加到喜欢列表",
        icon: "success"
      });
    },
    viewAllMatches() {
      common_vendor.index.showToast({
        title: "查看全部匹配",
        icon: "none"
      });
    },
    viewMatchDetail(matchId) {
      common_vendor.index.showToast({
        title: `查看匹配详情: ${matchId}`,
        icon: "none"
      });
    },
    createMatch() {
      common_vendor.index.showModal({
        title: "创建匹配",
        content: "确定要创建新的匹配请求吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "匹配请求已创建",
              icon: "success"
            });
          }
        }
      });
    }
  },
  onShow() {
    common_vendor.index.__f__("log", "at pages/match/match.vue:221", "匹配搭子页面显示");
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.destinationOptions[$data.destinationIndex]),
    b: $data.destinationOptions,
    c: $data.destinationIndex,
    d: common_vendor.o((...args) => $options.onDestinationChange && $options.onDestinationChange(...args)),
    e: common_vendor.t($data.dateOptions[$data.dateIndex]),
    f: $data.dateOptions,
    g: $data.dateIndex,
    h: common_vendor.o((...args) => $options.onDateChange && $options.onDateChange(...args)),
    i: common_vendor.o((...args) => $options.searchPartners && $options.searchPartners(...args)),
    j: common_vendor.f($data.recommendedPartners, (partner, k0, i0) => {
      return {
        a: partner.avatar,
        b: common_vendor.t(partner.name),
        c: common_vendor.t(partner.tags.join(" · ")),
        d: common_vendor.t(partner.matchRate),
        e: common_vendor.t(partner.destination),
        f: common_vendor.t(partner.travelDate),
        g: common_vendor.t(partner.travelStyle),
        h: common_vendor.o(($event) => $options.contactPartner(partner.id), partner.id),
        i: common_vendor.o(($event) => $options.likePartner(partner.id), partner.id),
        j: partner.id,
        k: common_vendor.o(($event) => $options.viewPartnerDetail(partner.id), partner.id)
      };
    }),
    k: common_vendor.o((...args) => $options.viewAllMatches && $options.viewAllMatches(...args)),
    l: common_vendor.f($data.myMatches, (match, k0, i0) => {
      return {
        a: match.avatar,
        b: common_vendor.t(match.name),
        c: common_vendor.t(match.status),
        d: common_vendor.t(match.lastContact),
        e: match.id,
        f: common_vendor.o(($event) => $options.viewMatchDetail(match.id), match.id)
      };
    }),
    m: common_vendor.o((...args) => $options.createMatch && $options.createMatch(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/match/match.js.map
