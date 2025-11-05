"use strict";
const common_vendor = require("../../../common/vendor.js");
const config_map_config = require("../../../config/map.config.js");
const services_guideService = require("../../../services/guideService.js");
const services_aiService = require("../../../services/aiService.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      destination: "",
      content: "",
      imagePath: "",
      tagInput: "",
      tags: [],
      // 编辑模式相关
      editMode: false,
      guideId: "",
      // 地图相关数据
      mapCenter: {
        longitude: config_map_config.mapConfig.defaultCenter.longitude,
        latitude: config_map_config.mapConfig.defaultCenter.latitude
      },
      mapScale: config_map_config.mapConfig.zoomLevel,
      markers: [],
      selectedLocation: null,
      isMapLoading: false,
      // 折线相关数据
      polyline: [],
      // 预览模式相关
      showPreview: false,
      showMapModal: false,
      showTransportationModal: false,
      // 用户信息
      userInfo: {
        nickName: "游客"
      },
      // 行程数据
      days: [],
      currentAttraction: null,
      // AI生成状态
      isGenerating: false
    };
  },
  onLoad(options) {
    if (options.id) {
      this.editMode = true;
      this.guideId = options.id;
      this.loadGuideData();
    }
    this.initMapData();
  },
  methods: {
    // 初始化地图数据
    initMapData() {
      this.markers = [];
      this.polyline = [];
    },
    // 加载攻略数据
    async loadGuideData() {
      try {
        const guideData = await services_guideService.guideService.getGuideById(this.guideId);
        this.title = guideData.title;
        this.destination = guideData.destination;
        this.content = guideData.content;
        this.imagePath = guideData.imagePath;
        this.tags = guideData.tags || [];
        this.days = guideData.days || [];
        this.generateMapMarkersFromDays();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:453", "加载攻略数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    },
    // 标题输入
    onTitleInput(e) {
      this.title = e.detail.value;
    },
    // 目的地输入
    onDestinationInput(e) {
      this.destination = e.detail.value;
    },
    // 内容输入
    onContentInput(e) {
      this.content = e.detail.value;
    },
    // 标签输入
    onTagInput(e) {
      this.tagInput = e.detail.value;
    },
    // 添加标签
    addTag() {
      if (this.tagInput.trim() && this.tags.length < 5) {
        this.tags.push(this.tagInput.trim());
        this.tagInput = "";
      }
    },
    // 移除标签
    removeTag(index) {
      this.tags.splice(index, 1);
    },
    // 选择图片
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.imagePath = res.tempFilePaths[0];
        }
      });
    },
    // 移除图片
    removeImage() {
      this.imagePath = "";
    },
    // 地图点击
    onMapTap(e) {
      const { latitude, longitude } = e.detail;
      this.selectedLocation = {
        latitude,
        longitude
      };
      this.addMarker(latitude, longitude);
    },
    // 标记点击
    onMarkerTap(e) {
      const markerId = e.detail.markerId;
      const marker = this.markers.find((m) => m.id === markerId);
      if (marker) {
        this.selectedLocation = {
          latitude: marker.latitude,
          longitude: marker.longitude
        };
      }
    },
    // 添加标记
    addMarker(latitude, longitude) {
      const markerId = this.markers.length + 1;
      this.markers.push({
        id: markerId,
        latitude,
        longitude,
        iconPath: "/static/images/marker.png",
        width: 30,
        height: 30
      });
      this.updatePolyline();
    },
    // 更新折线
    updatePolyline() {
      if (this.markers.length > 1) {
        this.polyline = [{
          points: this.markers.map((marker) => ({
            latitude: marker.latitude,
            longitude: marker.longitude
          })),
          color: "#1A9E8F",
          width: 4,
          dottedLine: false
        }];
      } else {
        this.polyline = [];
      }
    },
    // 清除标记
    clearMarkers() {
      this.markers = [];
      this.polyline = [];
      this.selectedLocation = null;
    },
    // 地图定位
    locateOnMap() {
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          this.mapCenter.latitude = res.latitude;
          this.mapCenter.longitude = res.longitude;
          this.addMarker(res.latitude, res.longitude);
        }
      });
    },
    // 地图搜索
    searchOnMap() {
      common_vendor.index.showToast({
        title: "搜索功能开发中",
        icon: "none"
      });
    },
    // AI生成攻略
    async generateWithAI() {
      if (!this.destination) {
        common_vendor.index.showToast({
          title: "请先填写目的地",
          icon: "none"
        });
        return;
      }
      this.isGenerating = true;
      try {
        const result = await services_aiService.aiService.generateGuide({
          destination: this.destination,
          days: 3
        });
        this.content = result.content;
        this.days = result.days || [];
        this.generateMapMarkersFromDays();
        common_vendor.index.showToast({
          title: "AI生成成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:623", "AI生成失败:", error);
        common_vendor.index.showToast({
          title: "生成失败，请重试",
          icon: "none"
        });
      } finally {
        this.isGenerating = false;
      }
    },
    // 根据天数生成地图标记
    generateMapMarkersFromDays() {
      this.markers = [];
      if (this.days && this.days.length > 0) {
        this.days.forEach((day) => {
          if (day.attractions && day.attractions.length > 0) {
            day.attractions.forEach((attraction, index) => {
              if (attraction.coordinates) {
                this.markers.push({
                  id: attraction.id || `${day.day}-${index}`,
                  latitude: attraction.coordinates.latitude,
                  longitude: attraction.coordinates.longitude,
                  title: attraction.name,
                  iconPath: "/static/images/marker.png",
                  width: 30,
                  height: 30
                });
              }
            });
          }
        });
        this.updatePolyline();
      }
    },
    // 批量添加坐标
    batchAddCoordinates() {
      common_vendor.index.showToast({
        title: "批量添加坐标功能开发中",
        icon: "none"
      });
    },
    // 切换天数展开状态
    toggleDay(dayNumber) {
      const day = this.days.find((d) => d.day === dayNumber);
      if (day) {
        day.expanded = !day.expanded;
      }
    },
    // 切换景点展开状态
    toggleAttraction(attractionId) {
      for (const day of this.days) {
        if (day.attractions) {
          const attraction = day.attractions.find((a) => a.id === attractionId);
          if (attraction) {
            attraction.expanded = !attraction.expanded;
            break;
          }
        }
      }
    },
    // 切换预览模式
    togglePreview() {
      this.showPreview = !this.showPreview;
      if (this.showPreview) {
        this.generateMapMarkersFromDays();
      }
    },
    // 保存草稿
    async saveDraft() {
      try {
        const guideData = {
          title: this.title,
          destination: this.destination,
          content: this.content,
          imagePath: this.imagePath,
          tags: this.tags,
          days: this.days
        };
        if (this.editMode) {
          await services_guideService.guideService.updateGuide(this.guideId, guideData);
        } else {
          await services_guideService.guideService.createGuide(guideData);
        }
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:722", "保存草稿失败:", error);
        common_vendor.index.showToast({
          title: "保存失败",
          icon: "none"
        });
      }
    },
    // 发布攻略
    async publishGuide() {
      if (!this.validateForm()) {
        return;
      }
      try {
        const guideData = {
          title: this.title,
          destination: this.destination,
          content: this.content,
          imagePath: this.imagePath,
          tags: this.tags,
          days: this.days,
          published: true
        };
        if (this.editMode) {
          await services_guideService.guideService.updateGuide(this.guideId, guideData);
        } else {
          const result = await services_guideService.guideService.createGuide(guideData);
          this.guideId = result.id;
        }
        common_vendor.index.showToast({
          title: "发布成功",
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/guide/edit/edit.vue:764", "发布攻略失败:", error);
        common_vendor.index.showToast({
          title: "发布失败",
          icon: "none"
        });
      }
    },
    // 表单验证
    validateForm() {
      if (!this.title.trim()) {
        common_vendor.index.showToast({
          title: "请填写攻略标题",
          icon: "none"
        });
        return false;
      }
      if (!this.destination.trim()) {
        common_vendor.index.showToast({
          title: "请填写目的地",
          icon: "none"
        });
        return false;
      }
      if (!this.content.trim()) {
        common_vendor.index.showToast({
          title: "请填写攻略内容",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    // 返回上一页
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
  return common_vendor.e({
    a: !$data.showPreview
  }, !$data.showPreview ? common_vendor.e({
    b: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    c: common_vendor.t($data.editMode ? "编辑攻略" : "创建攻略"),
    d: $data.content
  }, $data.content ? {
    e: common_vendor.o((...args) => $options.togglePreview && $options.togglePreview(...args))
  } : {}, {
    f: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    g: common_vendor.o((...args) => $options.publishGuide && $options.publishGuide(...args)),
    h: !$data.imagePath
  }, !$data.imagePath ? {
    i: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {
    j: $data.imagePath,
    k: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args)),
    l: common_vendor.o((...args) => $options.removeImage && $options.removeImage(...args))
  }, {
    m: common_vendor.o((...args) => $options.onTitleInput && $options.onTitleInput(...args)),
    n: $data.title,
    o: common_vendor.o((...args) => $options.onDestinationInput && $options.onDestinationInput(...args)),
    p: $data.destination,
    q: common_vendor.o((...args) => $options.locateOnMap && $options.locateOnMap(...args)),
    r: common_vendor.o((...args) => $options.searchOnMap && $options.searchOnMap(...args)),
    s: common_vendor.o((...args) => $options.clearMarkers && $options.clearMarkers(...args)),
    t: $data.mapCenter.longitude,
    v: $data.mapCenter.latitude,
    w: $data.mapScale,
    x: $data.markers,
    y: $data.polyline,
    z: common_vendor.o((...args) => $options.onMapTap && $options.onMapTap(...args)),
    A: common_vendor.o((...args) => $options.onMarkerTap && $options.onMarkerTap(...args)),
    B: $data.isMapLoading
  }, $data.isMapLoading ? {} : {}, {
    C: $data.selectedLocation
  }, $data.selectedLocation ? {
    D: common_vendor.t($data.selectedLocation.address || "自定义位置"),
    E: common_vendor.t($data.selectedLocation.longitude.toFixed(6)),
    F: common_vendor.t($data.selectedLocation.latitude.toFixed(6))
  } : {}, {
    G: common_vendor.t($data.isGenerating ? "生成中..." : "AI生成"),
    H: common_vendor.o((...args) => $options.generateWithAI && $options.generateWithAI(...args)),
    I: $data.isGenerating,
    J: common_vendor.o((...args) => $options.onContentInput && $options.onContentInput(...args)),
    K: $data.content,
    L: common_vendor.t($data.content.length),
    M: common_vendor.o((...args) => $options.onTagInput && $options.onTagInput(...args)),
    N: $data.tagInput,
    O: common_vendor.o((...args) => $options.addTag && $options.addTag(...args)),
    P: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: common_vendor.o(($event) => $options.removeTag(index), index),
        c: index
      };
    })
  }) : common_vendor.e({
    Q: common_vendor.o((...args) => $options.togglePreview && $options.togglePreview(...args)),
    R: common_vendor.t($data.title || "未命名攻略"),
    S: common_vendor.o((...args) => $options.saveDraft && $options.saveDraft(...args)),
    T: common_vendor.o((...args) => $options.publishGuide && $options.publishGuide(...args)),
    U: $data.imagePath || "/static/images/default-cover.jpg",
    V: common_vendor.t($data.title || "未命名攻略"),
    W: common_vendor.t($data.destination ? `探索${$data.destination}的精彩旅程` : "创建您的专属旅行攻略"),
    X: $data.days && $data.days.length > 0
  }, $data.days && $data.days.length > 0 ? common_vendor.e({
    Y: $data.days.some((day) => day.attractions && day.attractions.some((attraction) => !attraction.coordinates))
  }, $data.days.some((day) => day.attractions && day.attractions.some((attraction) => !attraction.coordinates)) ? {
    Z: common_vendor.o((...args) => $options.batchAddCoordinates && $options.batchAddCoordinates(...args))
  } : {}, {
    aa: common_vendor.o((...args) => $options.generateMapMarkersFromDays && $options.generateMapMarkersFromDays(...args))
  }) : {}, {
    ab: $data.days && $data.days.length > 0
  }, $data.days && $data.days.length > 0 ? {
    ac: common_vendor.f($data.days, (day, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(day.day),
        b: common_vendor.t(day.title),
        c: common_vendor.t(day.expanded ? "▼" : "▶"),
        d: common_vendor.o(($event) => $options.toggleDay(day.day), day.day),
        e: day.expanded
      }, day.expanded ? {
        f: common_vendor.f(day.attractions, (attraction, index, i1) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: common_vendor.t(attraction.name),
            c: common_vendor.t(attraction.expanded ? "▼" : "▶"),
            d: common_vendor.o(($event) => $options.toggleAttraction(attraction.id), attraction.id),
            e: attraction.expanded
          }, attraction.expanded ? common_vendor.e({
            f: common_vendor.t(attraction.description),
            g: common_vendor.t(attraction.duration),
            h: common_vendor.t(attraction.coordinates ? "📍 已添加坐标" : "❌ 未添加坐标"),
            i: attraction.coordinates ? 1 : "",
            j: !attraction.coordinates ? 1 : "",
            k: attraction.transportation && attraction.transportation.subway
          }, attraction.transportation && attraction.transportation.subway ? {
            l: common_vendor.t(attraction.transportation.subway.time),
            m: common_vendor.t(attraction.transportation.subway.cost)
          } : {}, {
            n: attraction.transportation && attraction.transportation.taxi
          }, attraction.transportation && attraction.transportation.taxi ? {
            o: common_vendor.t(attraction.transportation.taxi.time),
            p: common_vendor.t(attraction.transportation.taxi.cost)
          } : {}, {
            q: !attraction.transportation || !attraction.transportation.subway && !attraction.transportation.taxi
          }, !attraction.transportation || !attraction.transportation.subway && !attraction.transportation.taxi ? {} : {}, {
            r: attraction.expanded ? 1 : ""
          }) : {}, {
            s: attraction.id
          });
        })
      } : {}, {
        g: day.day
      });
    })
  } : {}, {
    ad: common_vendor.t($data.content || "暂无内容，请添加详细的攻略内容..."),
    ae: $data.tags.length > 0
  }, $data.tags.length > 0 ? {
    af: common_vendor.f($data.tags, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index
      };
    })
  } : {}, {
    ag: common_vendor.o(($event) => $data.showMapModal = true),
    ah: $data.mapCenter.longitude,
    ai: $data.mapCenter.latitude,
    aj: $data.mapScale,
    ak: $data.markers,
    al: $data.polyline
  }), {
    am: $data.showMapModal
  }, $data.showMapModal ? {
    an: common_vendor.o(($event) => $data.showMapModal = false),
    ao: common_vendor.t($data.title || "攻略"),
    ap: common_vendor.o(($event) => $data.showMapModal = false),
    aq: $data.mapCenter.longitude,
    ar: $data.mapCenter.latitude,
    as: $data.mapScale,
    at: $data.markers,
    av: $data.polyline
  } : {}, {
    aw: $data.showTransportationModal
  }, $data.showTransportationModal ? {
    ax: common_vendor.o(($event) => $data.showTransportationModal = false),
    ay: common_vendor.t((_a = $data.currentAttraction) == null ? void 0 : _a.name),
    az: common_vendor.o(($event) => $data.showTransportationModal = false),
    aA: common_vendor.t((_d = (_c = (_b = $data.currentAttraction) == null ? void 0 : _b.transportation) == null ? void 0 : _c.subway) == null ? void 0 : _d.time),
    aB: common_vendor.t((_g = (_f = (_e = $data.currentAttraction) == null ? void 0 : _e.transportation) == null ? void 0 : _f.subway) == null ? void 0 : _g.cost),
    aC: common_vendor.t((_j = (_i = (_h = $data.currentAttraction) == null ? void 0 : _h.transportation) == null ? void 0 : _i.taxi) == null ? void 0 : _j.time),
    aD: common_vendor.t((_m = (_l = (_k = $data.currentAttraction) == null ? void 0 : _k.transportation) == null ? void 0 : _l.taxi) == null ? void 0 : _m.cost)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/guide/edit/edit.js.map
