"use strict";
const common_vendor = require("../../../common/vendor.js");
const services_guideService = require("../../../services/guideService.js");
const _sfc_main = {
  data() {
    return {
      guideId: "",
      guide: null,
      loading: true
    };
  },
  onLoad(options) {
    this.guideId = options.id;
    this.loadGuideDetail();
  },
  methods: {
    // 加载攻略详情
    loadGuideDetail() {
      this.loading = true;
      setTimeout(() => {
        this.guide = services_guideService.guideService.getGuideById(this.guideId);
        this.loading = false;
      }, 500);
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    },
    // 编辑攻略
    editGuide() {
      common_vendor.index.navigateTo({
        url: `/pages/guide/edit/edit?id=${this.guideId}`
      });
    },
    // 删除攻略
    deleteGuide() {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "确定要删除这个攻略吗？此操作不可恢复。",
        success: (res) => {
          if (res.confirm) {
            const success = services_guideService.guideService.deleteGuide(this.guideId);
            if (success) {
              common_vendor.index.showToast({
                title: "删除成功",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
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
      return date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0") + " " + date.getHours().toString().padStart(2, "0") + ":" + date.getMinutes().toString().padStart(2, "0");
    },
    // 获取折线数据
    getPolyline(markers) {
      if (!markers || markers.length < 2) {
        return [];
      }
      const points = markers.map((marker) => ({
        longitude: marker.longitude,
        latitude: marker.latitude
      }));
      return [{
        points,
        color: "#1A9E8F",
        width: 4,
        arrowLine: true,
        borderWidth: 2,
        borderColor: "#FFFFFF"
      }];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.editGuide && $options.editGuide(...args)),
    b: common_vendor.o((...args) => $options.deleteGuide && $options.deleteGuide(...args)),
    c: $data.loading
  }, $data.loading ? {} : !$data.guide ? {
    e: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  } : common_vendor.e({
    f: $data.guide.imagePath
  }, $data.guide.imagePath ? {
    g: $data.guide.imagePath
  } : {}, {
    h: common_vendor.t($data.guide.title),
    i: common_vendor.t($data.guide.status === "published" ? "已发布" : "草稿"),
    j: common_vendor.n($data.guide.status),
    k: common_vendor.t($data.guide.destination || "未设置目的地"),
    l: common_vendor.t($options.formatDate($data.guide.createTime)),
    m: common_vendor.t($options.formatDate($data.guide.updateTime || $data.guide.createTime)),
    n: common_vendor.t($data.guide.content ? $data.guide.content.length : 0),
    o: $data.guide.tags && $data.guide.tags.length > 0
  }, $data.guide.tags && $data.guide.tags.length > 0 ? {
    p: common_vendor.f($data.guide.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    })
  } : {}, {
    q: common_vendor.t($data.guide.content || "暂无内容"),
    r: $data.guide.mapMarkers && $data.guide.mapMarkers.length > 0
  }, $data.guide.mapMarkers && $data.guide.mapMarkers.length > 0 ? {
    s: $data.guide.mapMarkers[0].longitude,
    t: $data.guide.mapMarkers[0].latitude,
    v: $data.guide.mapMarkers,
    w: $options.getPolyline($data.guide.mapMarkers)
  } : {}), {
    d: !$data.guide
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/guide/detail/detail.js.map
